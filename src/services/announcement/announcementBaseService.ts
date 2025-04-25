
import { supabase } from "@/integrations/supabase/client";
import type { CreateAnnouncementParams } from "./types/announcement";

export const announcementBaseService = {
  async createAnnouncement({ title, content, is_global, memberIds }: CreateAnnouncementParams): Promise<string> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Authentication error:", authError);
      throw new Error("User not authenticated");
    }
    
    console.log("Creating announcement:", {
      title,
      is_global,
      memberCount: memberIds?.length || 0
    });
    
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
      
    if (error) {
      console.error("Error creating announcement:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned after creating announcement");
    }
    
    return data.id;
  }
};
