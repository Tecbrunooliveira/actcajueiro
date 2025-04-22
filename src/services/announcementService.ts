
import { supabase } from "@/integrations/supabase/client";

// Busca comunicados para membros comuns (com base no user membro)
export const getMyAnnouncements = async () => {
  const { data, error } = await supabase
    .from("announcement_recipients")
    .select("id, announcement:announcement_id(id, title, content, created_at, is_global), read_at")
    .is("read_at", null); // apenas não lidas

  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    announcement: row.announcement,
    read_at: row.read_at,
  }));
};

export const confirmAnnouncementReceived = async (recipientId: string) => {
  const { error } = await supabase
    .from("announcement_recipients")
    .update({ read_at: new Date().toISOString() })
    .eq("id", recipientId);
  if (error) throw error;
};

export const createAnnouncement = async ({ title, content, is_global, memberIds }) => {
  // Cria comunicado
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title, 
      content, 
      is_global,
      created_by: supabase.auth.getUser().then(res => res.data.user?.id) || ''
    })
    .select("id")
    .single();
  if (error) throw error;

  // Adiciona destinatários
  const announcementId = data.id;
  const recipients = is_global
    ? await supabase.from("members").select("id").then((res) => (res.data || []).map((m) => m.id))
    : memberIds;

  const rows = recipients.map((member_id) => ({
    announcement_id: announcementId,
    member_id,
  }));

  if (rows.length) {
    const { error: recError } = await supabase.from("announcement_recipients").insert(rows);
    if (recError) throw recError;
  }

  return announcementId;
};
