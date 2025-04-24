
import { supabase } from "@/integrations/supabase/client";

export const announcementQueryService = {
  async getMyAnnouncements() {
    console.log("Starting getMyAnnouncements");
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("User not authenticated:", userError);
      throw new Error("User not authenticated");
    }

    console.log("Authenticated user ID:", userData.user.id, "Email:", userData.user.email);

    // Get the member ID associated with the user
    console.log("Getting member ID for user:", userData.user.id);
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
      console.error("No member data found for user. The user is not associated with any member in the members table.");
      return [];
    }

    const memberId = memberData.id;
    console.log("Found member ID:", memberId, "Name:", memberData.name);

    try {
      // First check if the announcements exist at all (to diagnose the issue)
      const { data: allAnnouncementsData, error: allAnnouncementsError } = await supabase
        .from("announcements")
        .select("*");
        
      if (allAnnouncementsError) {
        console.error("Error fetching all announcements:", allAnnouncementsError);
      } else {
        console.log("All announcements in DB:", allAnnouncementsData?.length || 0);
        if (allAnnouncementsData && allAnnouncementsData.length > 0) {
          console.log("All announcement IDs in database:", allAnnouncementsData.map(a => a.id));
          allAnnouncementsData.forEach(a => {
            console.log(`DB announcement: ${a.id} - ${a.title} - created by: ${a.created_by}`);
          });
        } else {
          console.log("⚠️ No announcements found in the database at all. Please create some announcements first.");
        }
      }

      // Get all recipients for this member
      const { data: recipientsData, error: recipientsError } = await supabase
        .from("announcement_recipients")
        .select("id, announcement_id, read_at")
        .eq("member_id", memberId);
      
      if (recipientsError) {
        console.error("Error fetching recipients:", recipientsError);
        throw recipientsError;
      }
      
      console.log("All announcement recipients for member:", recipientsData?.length || 0);
      
      if (!recipientsData || recipientsData.length === 0) {
        console.log("No announcements for this member");
        return [];
      }

      // Log all recipient records for debugging
      console.log("Recipient records:", recipientsData.map(r => ({
        id: r.id,
        announcement_id: r.announcement_id,
        read_at: r.read_at
      })));

      // Separate unread recipients
      const unreadRecipients = recipientsData.filter(r => r.read_at === null);
      console.log("Unread announcement recipients:", unreadRecipients.length);

      if (unreadRecipients.length === 0) {
        console.log("No unread announcements for this member - all announcements have already been marked as read");
        return [];
      }

      // Get the actual announcements
      const announcementIds = unreadRecipients.map(r => r.announcement_id);
      console.log("Fetching announcements with IDs:", announcementIds);
      
      const { data: announcementsData, error: announcementsError } = await supabase
        .from("announcements")
        .select("id, title, content, is_global, created_by, created_at")
        .in("id", announcementIds);
      
      if (announcementsError) {
        console.error("Error fetching announcements:", announcementsError);
        throw announcementsError;
      }
      
      console.log("Fetched announcements:", announcementsData?.length || 0);
      
      // CRITICAL CHANGE: If there are no announcements found, cleanup the orphaned records
      if (!announcementsData || announcementsData.length === 0) {
        console.error("❌ Critical: No announcement data found for the specific IDs. This suggests data integrity issues.");
        console.log("Attempting to clean up orphaned recipient records...");
        
        // Fix: Clean up orphaned recipient records
        for (const recipient of unreadRecipients) {
          // Mark the orphaned record as read to prevent it from showing up again
          await supabase
            .from("announcement_recipients")
            .update({ read_at: new Date().toISOString() })
            .eq("id", recipient.id);
            
          console.log(`Marked orphaned recipient ${recipient.id} as read to prevent it from appearing again`);
        }
        
        // Return empty array as there are no valid announcements
        return [];
      }

      // Enhancement: Log which IDs were found and which weren't (to identify orphaned records)
      const foundAnnouncementIds = announcementsData.map(a => a.id);
      const missingIds = announcementIds.filter(id => !foundAnnouncementIds.includes(id));
      
      if (missingIds.length > 0) {
        console.log("⚠️ Some announcement IDs from recipients don't exist in the announcements table:", missingIds);
        
        // Also clean up these specific orphaned records
        for (const recipient of unreadRecipients.filter(r => missingIds.includes(r.announcement_id))) {
          await supabase
            .from("announcement_recipients")
            .update({ read_at: new Date().toISOString() })
            .eq("id", recipient.id);
            
          console.log(`Marked orphaned recipient ${recipient.id} with missing announcement as read`);
        }
      }

      // Enhanced logging for debugging
      console.log("🎉 Successfully found matching announcements:");
      announcementsData.forEach(a => {
        console.log(`Found announcement: ${a.id} - ${a.title} - created by: ${a.created_by}`);
      });
      
      // Combine unread recipient and announcement data (only for valid announcements)
      const result = unreadRecipients
        .filter(recipient => foundAnnouncementIds.includes(recipient.announcement_id))
        .map(recipient => {
          const announcement = announcementsData.find(a => a.id === recipient.announcement_id);
          if (announcement) {
            console.log(`Matched announcement: ${announcement.title} for recipient ID: ${recipient.id}`);
          }
          return {
            id: recipient.id,
            announcement: announcement || null
          };
        })
        .filter(item => item.announcement !== null);
      
      console.log("Final processed announcements to show:", result.length);
      if (result.length > 0) {
        console.log("First announcement title:", result[0].announcement.title);
      }
      
      return result;
    } catch (error) {
      console.error("Error processing announcements:", error);
      throw error;
    }
  },
  
  // New method to fix orphaned recipient records in the database
  async cleanupOrphanedRecipients() {
    try {
      console.log("Starting cleanup of orphaned recipient records");
      
      // Get all announcement IDs
      const { data: announcements, error: announcementError } = await supabase
        .from("announcements")
        .select("id");
        
      if (announcementError) {
        console.error("Error fetching announcements for cleanup:", announcementError);
        return false;
      }
      
      if (!announcements || announcements.length === 0) {
        console.log("No announcements found in the database - will mark all recipients as read");
        
        // If there are no announcements at all, mark all recipients as read
        const { error } = await supabase
          .from("announcement_recipients")
          .update({ read_at: new Date().toISOString() })
          .is("read_at", null);
          
        if (error) {
          console.error("Error marking all recipients as read:", error);
          return false;
        }
        
        console.log("Successfully marked all recipients as read since no announcements exist");
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
      
      console.log("Successfully cleaned up orphaned recipient records");
      return true;
    } catch (error) {
      console.error("Error during orphaned recipient cleanup:", error);
      return false;
    }
  }
};
