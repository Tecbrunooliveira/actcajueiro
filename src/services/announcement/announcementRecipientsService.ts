
import { supabase } from "@/integrations/supabase/client";

export const announcementRecipientsService = {
  async addRecipients(announcementId: string, is_global: boolean, memberIds?: string[]) {
    let recipients: string[] = [];
    
    if (is_global) {
      console.log("Global announcement, fetching all members");
      const { data: allMembers, error: membersError } = await supabase
        .from("members")
        .select("id");
        
      if (membersError) {
        console.error("Error fetching members for global announcement:", membersError);
        throw membersError;
      }
      recipients = (allMembers || []).map(m => m.id);
      console.log(`Adding ${recipients.length} members as recipients`);
    } else {
      recipients = memberIds || [];
      console.log(`Adding ${recipients.length} selected members as recipients`);
    }

    if (recipients.length) {
      const rows = recipients.map((member_id) => ({
        announcement_id: announcementId,
        member_id,
      }));

      const { error: recError } = await supabase
        .from("announcement_recipients")
        .insert(rows);
        
      if (recError) {
        console.error("Error creating recipients:", recError);
        throw recError;
      }
      console.log(`Successfully added ${rows.length} recipients`);
    }
  },

  async confirmReceipt(recipientId: string) {
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
    return true;
  }
};
