
import { supabase } from "@/integrations/supabase/client";
import { logDebug } from "../utils/logging";

export async function cleanupOrphanedRecipients() {
  try {
    logDebug.orphanedCleanup.start();
    
    // Get all announcement IDs
    const { data: announcements, error: announcementError } = await supabase
      .from("announcements")
      .select("id");
      
    if (announcementError) {
      console.error("Error fetching announcements for cleanup:", announcementError);
      return false;
    }
    
    if (!announcements || announcements.length === 0) {
      logDebug.orphanedCleanup.noAnnouncements();
      
      // If there are no announcements at all, mark all recipients as read
      const { error } = await supabase
        .from("announcement_recipients")
        .update({ read_at: new Date().toISOString() })
        .is("read_at", null);
        
      if (error) {
        console.error("Error marking all recipients as read:", error);
        return false;
      }
      
      return true;
    }
    
    // Get the list of valid announcement IDs
    const validIds = announcements.map(a => a.id);
    
    // Mark as read any recipient records that refer to non-existent announcements
    const { error } = await supabase
      .from("announcement_recipients")
      .update({ read_at: new Date().toISOString() })
      .is("read_at", null)
      .not("announcement_id", "in", `(${validIds.map(id => `'${id}'`).join(',')})`);
      
    if (error) {
      console.error("Error cleaning up orphaned recipients:", error);
      return false;
    }
    
    logDebug.orphanedCleanup.success();
    return true;
  } catch (error) {
    logDebug.orphanedCleanup.error(error);
    return false;
  }
}
