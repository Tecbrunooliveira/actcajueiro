
import { Member, MemberStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const memberService = {
  getAllMembers: async (): Promise<Member[]> => {
    const { data, error } = await supabase
      .from('members')
      .select('*');
    
    if (error) {
      console.error('Error fetching members:', error);
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
    })) || [];
  },

  getMemberById: async (id: string): Promise<Member | null> => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();
    
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
      })
      .select()
      .single();
    
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
      })
      .eq('id', member.id)
      .select()
      .single();
    
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
      .select('*')
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
    })) || [];
  },
};
