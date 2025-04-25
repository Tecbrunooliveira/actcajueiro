
import { supabase } from "@/integrations/supabase/client";

export async function fetchAllMembers(): Promise<string[]> {
  const { data: allMembers, error: membersError } = await supabase
    .from("members")
    .select("id");
    
  if (membersError) {
    console.error("Error fetching members for global announcement:", membersError);
    throw membersError;
  }
  return (allMembers || []).map(m => m.id);
}
