
import { supabase } from "@/integrations/supabase/client";
import { logDebug } from "./logging";

export async function getUnreadRecipients(recipientsData: any[]) {
  if (!recipientsData || recipientsData.length === 0) {
    return [];
  }

  logDebug.recipients.records(recipientsData);
  const unreadRecipients = recipientsData.filter(r => r.read_at === null);
  logDebug.recipients.unread(unreadRecipients.length);

  if (unreadRecipients.length === 0) {
    logDebug.recipients.allRead();
    return [];
  }

  return unreadRecipients;
}

export async function processAnnouncementsForRecipients(unreadRecipients: any[]) {
  const announcementIds = unreadRecipients.map(r => r.announcement_id);
  
  const { data: announcementsData, error: announcementsError } = await supabase
    .from("announcements")
    .select("id, title, content, is_global, created_by, created_at")
    .in("id", announcementIds);
  
  if (announcementsError) {
    console.error("Error fetching announcements:", announcementsError);
    throw announcementsError;
  }

  return { announcementsData };
}
