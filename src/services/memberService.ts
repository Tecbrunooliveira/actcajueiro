
import { Member, MemberStatus, Position } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const memberService = {
  getAllMembers: async (): Promise<Member[]> => {
    const { data, error } = await supabase
      .from('members')
      .select('*, position:positions(id, name)');
    
    if (error) {
      console.error('Error fetching members:', error);
      return [];
    }
    
    // Transform: member.position becomes object or undefined
    return data?.map(member => ({
      id: member.id,
      name: member.name,
      status: member.status as MemberStatus,
      email: member.email || undefined,
      phone: member.phone || undefined,
      joinDate: member.join_date,
      notes: member.notes || undefined,
      photo: member.photo || undefined,
      warnings: member.warnings as Array<{ text: string; date: string }> || [],
      user_id: member.user_id || undefined,
      level: member.level,
      position_id: member.position_id || undefined,
      position: member.position || undefined,
    })) || [];
  },

  getMemberById: async (id: string): Promise<Member | null> => {
    const { data, error } = await supabase
      .from('members')
      .select('*, position:positions(id, name)')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching member:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      status: data.status as MemberStatus,
      email: data.email || undefined,
      phone: data.phone || undefined,
      joinDate: data.join_date,
      notes: data.notes || undefined,
      photo: data.photo || undefined,
      warnings: data.warnings as Array<{ text: string; date: string }> || [],
      user_id: data.user_id || undefined,
      level: data.level,
      position_id: data.position_id || undefined,
      position: data.position || undefined,
    };
  },

  createMember: async (member: Omit<Member, "id">): Promise<Member | null> => {
    const { data, error } = await supabase
      .from('members')
      .insert({
        name: member.name,
        status: member.status,
        email: member.email,
        phone: member.phone,
        join_date: member.joinDate,
        notes: member.notes,
        photo: member.photo,
        warnings: member.warnings || [],
        user_id: member.user_id,
        level: member.level,
        position_id: member.position_id,
      })
      .select('*, position:positions(id, name)')
      .maybeSingle();
    
    if (error) {
      console.error('Error creating member:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      status: data.status as MemberStatus,
      email: data.email || undefined,
      phone: data.phone || undefined,
      joinDate: data.join_date,
      notes: data.notes || undefined,
      photo: data.photo || undefined,
      warnings: data.warnings as Array<{ text: string; date: string }> || [],
      user_id: data.user_id || undefined,
      level: data.level,
      position_id: data.position_id || undefined,
      position: data.position || undefined,
    };
  },

  updateMember: async (member: Member): Promise<Member | null> => {
    const { data, error } = await supabase
      .from('members')
      .update({
        name: member.name,
        status: member.status,
        email: member.email,
        phone: member.phone,
        join_date: member.joinDate,
        notes: member.notes,
        photo: member.photo,
        warnings: member.warnings || [],
        user_id: member.user_id,
        level: member.level,
        position_id: member.position_id,
      })
      .eq('id', member.id)
      .select('*, position:positions(id, name)')
      .maybeSingle();

    if (error) {
      console.error('Error updating member:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      status: data.status as MemberStatus,
      email: data.email || undefined,
      phone: data.phone || undefined,
      joinDate: data.join_date,
      notes: data.notes || undefined,
      photo: data.photo || undefined,
      warnings: data.warnings as Array<{ text: string; date: string }> || [],
      user_id: data.user_id || undefined,
      level: data.level,
      position_id: data.position_id || undefined,
      position: data.position || undefined,
    };
  },

  deleteMember: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  },

  getMembersByStatus: async (status: MemberStatus): Promise<Member[]> => {
    const { data, error } = await supabase
      .from('members')
      .select('*, position:positions(id, name)')
      .eq('status', status);
    
    if (error) {
      console.error('Error fetching members by status:', error);
      return [];
    }
    
    return data?.map(member => ({
      id: member.id,
      name: member.name,
      status: member.status as MemberStatus,
      email: member.email || undefined,
      phone: member.phone || undefined,
      joinDate: member.join_date,
      notes: member.notes || undefined,
      photo: member.photo || undefined,
      warnings: member.warnings as Array<{ text: string; date: string }> || [],
      user_id: member.user_id || undefined,
      level: member.level,
      position_id: member.position_id || undefined,
      position: member.position || undefined,
    })) || [];
  },

  associateUserWithMember: async (memberId: string, userId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('members')
      .update({ user_id: userId })
      .eq('id', memberId);
    
    if (error) {
      console.error('Error associating user with member:', error);
      return false;
    }
    
    return true;
  },
};

export const positionService = {
  getAll: async (): Promise<Position[]> => {
    const { data, error } = await supabase
      .from('positions')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
    return data || [];
  }
};
