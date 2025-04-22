
import { supabase } from "@/integrations/supabase/client";

// Busca comunicados para membros comuns (com base no user membro)
export const getMyAnnouncements = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  // Primeiro obtém o id do membro associado ao usuário
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
  
  const memberId = memberData?.id;
  
  if (!memberId) {
    console.log("No member associated with current user");
    return [];
  }

  console.log("Found member ID:", memberId);

  // Verifique se existem anúncios para este membro
  const { data: recipientData, error: recipientError } = await supabase
    .from("announcement_recipients")
    .select("id, announcement_id")
    .eq("member_id", memberId)
    .is("read_at", null);
    
  if (recipientError) {
    console.error("Error checking recipients:", recipientError);
    throw recipientError;
  }
  
  console.log("Found recipients:", recipientData);
  
  if (!recipientData || recipientData.length === 0) {
    console.log("No announcements found for this member");
    return [];
  }

  // Agora busca os anúncios completos
  const announcementIds = recipientData.map(r => r.announcement_id);
  console.log("Announcement IDs to fetch:", announcementIds);
  
  const { data: announcementsData, error: announcementsError } = await supabase
    .from("announcements")
    .select("id, title, content, created_at, is_global")
    .in("id", announcementIds);
    
  if (announcementsError) {
    console.error("Error fetching announcements:", announcementsError);
    throw announcementsError;
  }
  
  console.log("Raw announcements data:", announcementsData);
  
  // Combine the data
  const result = recipientData.map(recipient => {
    const announcement = announcementsData.find(a => a.id === recipient.announcement_id);
    return {
      id: recipient.id,
      announcement: announcement || null,
      read_at: null
    };
  }).filter(item => item.announcement !== null);
  
  console.log("Final announcement data:", result);
  
  return result;
};

export const confirmAnnouncementReceived = async (recipientId: string) => {
  const { error } = await supabase
    .from("announcement_recipients")
    .update({ read_at: new Date().toISOString() })
    .eq("id", recipientId);
  if (error) throw error;
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
