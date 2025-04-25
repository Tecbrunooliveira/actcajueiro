
import { supabase } from "@/integrations/supabase/client";

export const confirmationService = {
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
