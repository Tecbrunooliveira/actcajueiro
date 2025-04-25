
import { supabase } from "@/integrations/supabase/client";
import { fetchAllMembers } from "./memberUtils";

export const recipientsBaseService = {
  async addRecipients(announcementId: string, is_global: boolean, memberIds?: string[]) {
    let recipients: string[] = [];
    
    if (is_global) {
      console.log("Global announcement, fetching all members");
      recipients = await fetchAllMembers();
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
  }
};
