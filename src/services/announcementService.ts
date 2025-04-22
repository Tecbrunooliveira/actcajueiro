
import { supabase } from "@/integrations/supabase/client";

// Busca comunicados para membros comuns (com base no user membro)
export const getMyAnnouncements = async () => {
  console.log("Starting getMyAnnouncements");
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    console.error("User not authenticated:", userError);
    throw new Error("User not authenticated");
  }

  // First, get the member ID associated with the user
  console.log("Getting member ID for user:", userData.user.id);
  const { data: memberData, error: memberError } = await supabase
    .from("members")
    .select("id")
    .eq("user_id", userData.user.id)
    .single();
  
  if (memberError) {
    console.error("Error fetching member:", memberError);
    if (memberError.code === "PGRST116") {
      console.log("No member found for user ID:", userData.user.id);
      return [];
    }
    throw memberError;
  }
  
  if (!memberData) {
    console.log("No member data found for user");
    return [];
  }

  const memberId = memberData.id;
  console.log("Found member ID:", memberId);

  // Insert test announcement if none exist
  // First check if this user has any announcements
  const { data: existingRecipients } = await supabase
    .from("announcement_recipients")
    .select("id")
    .eq("member_id", memberId)
    .limit(1);

  if (!existingRecipients || existingRecipients.length === 0) {
    console.log("No announcements for this member, creating a test announcement");
    
    // Create test announcement
    const { data: newAnnouncement, error: createError } = await supabase
      .from("announcements")
      .insert({
        title: "Bem-vindo à Associação",
        content: "Seja bem-vindo! Este é um comunicado automático para novos sócios.",
        is_global: false,
        created_by: userData.user.id
      })
      .select("id")
      .single();
    
    if (createError) {
      console.error("Error creating test announcement:", createError);
    } else if (newAnnouncement) {
      // Add member as recipient
      const { error: recipientError } = await supabase
        .from("announcement_recipients")
        .insert({
          announcement_id: newAnnouncement.id,
          member_id: memberId
        });
      
      if (recipientError) {
        console.error("Error creating test recipient:", recipientError);
      } else {
        console.log("Created test announcement for member");
      }
    }
  }

  // Get announcement recipients for this member that haven't been read yet
  const { data: recipientsData, error: recipientsError } = await supabase
    .from("announcement_recipients")
    .select("id, announcement_id")
    .eq("member_id", memberId)
    .is("read_at", null);
  
  if (recipientsError) {
    console.error("Error fetching recipients:", recipientsError);
    throw recipientsError;
  }
  
  console.log("Unread announcement recipients:", recipientsData);
  
  if (!recipientsData || recipientsData.length === 0) {
    console.log("No unread announcements for this member");
    return [];
  }

  // Get the actual announcements
  const announcementIds = recipientsData.map(r => r.announcement_id);
  console.log("Fetching announcements with IDs:", announcementIds);
  
  const { data: announcementsData, error: announcementsError } = await supabase
    .from("announcements")
    .select("*")
    .in("id", announcementIds);
  
  if (announcementsError) {
    console.error("Error fetching announcements:", announcementsError);
    throw announcementsError;
  }
  
  console.log("Fetched announcements:", announcementsData);
  
  if (!announcementsData || announcementsData.length === 0) {
    console.log("No announcement data found");
    return [];
  }
  
  // Combine the recipient and announcement data
  const result = recipientsData.map(recipient => {
    const announcement = announcementsData.find(a => a.id === recipient.announcement_id);
    return {
      id: recipient.id,
      announcement: announcement
    };
  }).filter(item => item.announcement !== null);
  
  console.log("Final processed announcements:", result);
  return result;
};

export const confirmAnnouncementReceived = async (recipientId: string) => {
  console.log("Confirming announcement received:", recipientId);
  const { error } = await supabase
    .from("announcement_recipients")
    .update({ read_at: new Date().toISOString() })
    .eq("id", recipientId);
  
  if (error) {
    console.error("Error confirming announcement:", error);
    throw error;
  }
  console.log("Announcement confirmed successfully");
};

export const createAnnouncement = async ({ title, content, is_global, memberIds }) => {
  // Primeiro obtém o ID do usuário atual
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  // Cria comunicado
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title, 
      content, 
      is_global,
      created_by: user.id
    })
    .select("id")
    .single();
  if (error) throw error;

  // Adiciona destinatários
  const announcementId = data.id;
  let recipients = [];
  
  if (is_global) {
    // Se é global, busca todos os membros
    const { data: allMembers } = await supabase
      .from("members")
      .select("id");
    recipients = (allMembers || []).map(m => m.id);
  } else {
    // Se não é global, usa a lista de IDs fornecida
    recipients = memberIds;
  }

  if (recipients.length) {
    const rows = recipients.map((member_id) => ({
      announcement_id: announcementId,
      member_id,
    }));

    const { error: recError } = await supabase
      .from("announcement_recipients")
      .insert(rows);
    if (recError) throw recError;
  }

  return announcementId;
};
