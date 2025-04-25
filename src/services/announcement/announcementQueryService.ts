
import { supabase } from "@/integrations/supabase/client";
import { logDebug } from "./utils/logging";
import { getUnreadRecipients, processAnnouncementsForRecipients } from "./utils/recipientUtils";
import { cleanupOrphanedRecipients } from "./services/cleanupService";

export const announcementQueryService = {
  async getMyAnnouncements() {
    logDebug.startingCheck();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("User not authenticated:", userError);
      throw new Error("User not authenticated");
    }

    logDebug.userAuthenticated(userData.user.id, userData.user.email || '');
    logDebug.gettingMemberId(userData.user.id);

    // Get the member ID associated with the user
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("id, name")
      .eq("user_id", userData.user.id)
      .maybeSingle();
    
    if (memberError) {
      console.error("Error fetching member:", memberError);
      throw memberError;
    }
    
    if (!memberData) {
      logDebug.noMemberData();
      return [];
    }

    const memberId = memberData.id;
    logDebug.memberFound(memberId, memberData.name);

    try {
      // Get all recipients for this member
      const { data: recipientsData, error: recipientsError } = await supabase
        .from("announcement_recipients")
        .select("id, announcement_id, read_at")
        .eq("member_id", memberId);
      
      if (recipientsError) {
        console.error("Error fetching recipients:", recipientsError);
        throw recipientsError;
      }
      
      logDebug.recipients.total(recipientsData?.length || 0);
      
      const unreadRecipients = await getUnreadRecipients(recipientsData);
      if (unreadRecipients.length === 0) {
        return [];
      }

      const { announcementsData } = await processAnnouncementsForRecipients(unreadRecipients);
      
      if (!announcementsData || announcementsData.length === 0) {
        console.error("❌ Critical: No announcement data found for the specific IDs. This suggests data integrity issues.");
        // Clean up orphaned recipient records
        for (const recipient of unreadRecipients) {
          await supabase
            .from("announcement_recipients")
            .update({ read_at: new Date().toISOString() })
            .eq("id", recipient.id);
        }
        return [];
      }

      // Combine unread recipient and announcement data
      const result = unreadRecipients
        .filter(recipient => announcementsData.some(a => a.id === recipient.announcement_id))
        .map(recipient => ({
          id: recipient.id,
          announcement: announcementsData.find(a => a.id === recipient.announcement_id) || null
        }))
        .filter(item => item.announcement !== null);
      
      return result;
    } catch (error) {
      console.error("Error processing announcements:", error);
      throw error;
    }
  },
  
  cleanupOrphanedRecipients
};
