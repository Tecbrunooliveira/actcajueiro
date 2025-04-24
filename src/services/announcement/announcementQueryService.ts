
import { supabase } from "@/integrations/supabase/client";

export const announcementQueryService = {
  async getMyAnnouncements() {
    console.log("Starting getMyAnnouncements");
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("User not authenticated:", userError);
      throw new Error("User not authenticated");
    }

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
      console.log("No member data found for user");
      return [];
    }

    const memberId = memberData.id;
    console.log("Found member ID:", memberId, "Name:", memberData.name);

    // Get unread recipients for this member
    const { data: recipientsData, error: recipientsError } = await supabase
      .from("announcement_recipients")
      .select("id, announcement_id, read_at")
      .eq("member_id", memberId)
      .is("read_at", null);
    
    if (recipientsError) {
      console.error("Error fetching recipients:", recipientsError);
      throw recipientsError;
    }
    
    console.log("Unread announcement recipients:", recipientsData?.length || 0);
    
    if (!recipientsData || recipientsData.length === 0) {
      console.log("No unread announcements for this member");
      return [];
    }

    // Get the actual announcements - Debug: Log the raw SQL query
    const announcementIds = recipientsData.map(r => r.announcement_id);
    console.log("Fetching announcements with IDs:", announcementIds);
    
    // Execute the query without filters first to check if announcements exist at all
    const { data: allAnnouncementsData, error: allAnnouncementsError } = await supabase
      .from("announcements")
      .select("*");
      
    if (allAnnouncementsError) {
      console.error("Error fetching all announcements:", allAnnouncementsError);
    } else {
      console.log("All announcements in DB:", allAnnouncementsData?.length || 0);
      if (allAnnouncementsData && allAnnouncementsData.length > 0) {
        allAnnouncementsData.forEach(a => {
          console.log(`DB announcement: ${a.id} - ${a.title}`);
        });
      }
    }
    
    // Now try with the filter
    const { data: announcementsData, error: announcementsError } = await supabase
      .from("announcements")
      .select("*")
      .in("id", announcementIds);
    
    if (announcementsError) {
      console.error("Error fetching announcements:", announcementsError);
      throw announcementsError;
    }
    
    console.log("Fetched announcements:", announcementsData?.length || 0);
    
    // Add better logging to debug the issue
    if (!announcementsData || announcementsData.length === 0) {
      console.log("No announcement data found for the specific IDs");
      
      // Check if announcements exist but IDs don't match
      if (allAnnouncementsData && allAnnouncementsData.length > 0) {
        console.log("Potential ID mismatch between announcements and recipients");
        console.log("Announcement IDs from recipients:", announcementIds);
        console.log("Announcement IDs in database:", allAnnouncementsData.map(a => a.id));
      }
      
      return [];
    }

    // Enhanced logging for debugging
    announcementsData.forEach(a => {
      console.log(`Found announcement: ${a.id} - ${a.title}`);
    });
    
    // Combine recipient and announcement data
    const result = recipientsData.map(recipient => {
      const announcement = announcementsData.find(a => a.id === recipient.announcement_id);
      if (!announcement) {
        console.log(`No matching announcement found for ID: ${recipient.announcement_id}`);
      } else {
        console.log(`Matched announcement: ${announcement.title} for recipient ID: ${recipient.id}`);
      }
      return {
        id: recipient.id,
        announcement: announcement || null
      };
    }).filter(item => item.announcement !== null);
    
    console.log("Final processed announcements:", result.length);
    return result;
  }
};
