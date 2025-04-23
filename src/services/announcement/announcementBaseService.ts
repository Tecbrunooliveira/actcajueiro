
import { supabase } from "@/integrations/supabase/client";

export const announcementBaseService = {
  async createAnnouncement({ title, content, is_global, memberIds }: { 
    title: string; 
    content: string; 
    is_global: boolean; 
    memberIds?: string[] 
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
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
    
    return data.id;
  }
};
