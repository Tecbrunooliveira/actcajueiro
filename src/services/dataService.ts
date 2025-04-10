import { Member, Payment, MemberStatus, MonthlyRecord } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Member Service
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
    })) || [];
  },
};

// Payment Service
export const paymentService = {
  getAllPayments: async (): Promise<Payment[]> => {
    const { data, error } = await supabase
      .from('payments')
      .select('*');
    
    if (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
    
    return data?.map(payment => ({
      id: payment.id,
      memberId: payment.member_id,
      amount: payment.amount,
      date: payment.payment_date || "",
      month: payment.month,
      year: payment.year,
      isPaid: payment.is_paid,
      paymentMethod: payment.payment_method || undefined,
      notes: payment.notes || undefined,
    })) || [];
  },

  getPaymentById: async (id: string): Promise<Payment | null> => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching payment:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      memberId: data.member_id,
      amount: data.amount,
      date: data.payment_date || "",
      month: data.month,
      year: data.year,
      isPaid: data.is_paid,
      paymentMethod: data.payment_method || undefined,
      notes: data.notes || undefined,
    };
  },

  getPaymentsByMember: async (memberId: string): Promise<Payment[]> => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('member_id', memberId);
    
    if (error) {
      console.error('Error fetching payments by member:', error);
      return [];
    }
    
    return data?.map(payment => ({
      id: payment.id,
      memberId: payment.member_id,
      amount: payment.amount,
      date: payment.payment_date || "",
      month: payment.month,
      year: payment.year,
      isPaid: payment.is_paid,
      paymentMethod: payment.payment_method || undefined,
      notes: payment.notes || undefined,
    })) || [];
  },

  getPaymentsByMonth: async (month: string, year: number): Promise<Payment[]> => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('month', month)
      .eq('year', year);
    
    if (error) {
      console.error('Error fetching payments by month:', error);
      return [];
    }
    
    return data?.map(payment => ({
      id: payment.id,
      memberId: payment.member_id,
      amount: payment.amount,
      date: payment.payment_date || "",
      month: payment.month,
      year: payment.year,
      isPaid: payment.is_paid,
      paymentMethod: payment.payment_method || undefined,
      notes: payment.notes || undefined,
    })) || [];
  },

  createPayment: async (payment: Omit<Payment, "id">): Promise<Payment | null> => {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        member_id: payment.memberId,
        amount: payment.amount,
        payment_date: payment.date || null,
        month: payment.month,
        year: payment.year,
        is_paid: payment.isPaid,
        payment_method: payment.paymentMethod || null,
        notes: payment.notes || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      memberId: data.member_id,
      amount: data.amount,
      date: data.payment_date || "",
      month: data.month,
      year: data.year,
      isPaid: data.is_paid,
      paymentMethod: data.payment_method || undefined,
      notes: data.notes || undefined,
    };
  },

  updatePayment: async (payment: Payment): Promise<Payment | null> => {
    const { data, error } = await supabase
      .from('payments')
      .update({
        member_id: payment.memberId,
        amount: payment.amount,
        payment_date: payment.date || null,
        month: payment.month,
        year: payment.year,
        is_paid: payment.isPaid,
        payment_method: payment.paymentMethod || null,
        notes: payment.notes || null,
      })
      .eq('id', payment.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      memberId: data.member_id,
      amount: data.amount,
      date: data.payment_date || "",
      month: data.month,
      year: data.year,
      isPaid: data.is_paid,
      paymentMethod: data.payment_method || undefined,
      notes: data.notes || undefined,
    };
  },

  deletePayment: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  },

  getPaidPayments: async (): Promise<Payment[]> => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('is_paid', true);
    
    if (error) {
      console.error('Error fetching paid payments:', error);
      return [];
    }
    
    return data?.map(payment => ({
      id: payment.id,
      memberId: payment.member_id,
      amount: payment.amount,
      date: payment.payment_date || "",
      month: payment.month,
      year: payment.year,
      isPaid: payment.is_paid,
      paymentMethod: payment.payment_method || undefined,
      notes: payment.notes || undefined,
    })) || [];
  },

  getUnpaidPayments: async (): Promise<Payment[]> => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('is_paid', false);
    
    if (error) {
      console.error('Error fetching unpaid payments:', error);
      return [];
    }
    
    return data?.map(payment => ({
      id: payment.id,
      memberId: payment.member_id,
      amount: payment.amount,
      date: payment.payment_date || "",
      month: payment.month,
      year: payment.year,
      isPaid: payment.is_paid,
      paymentMethod: payment.payment_method || undefined,
      notes: payment.notes || undefined,
    })) || [];
  },

  getMemberPaymentStatus: async (memberId: string): Promise<{ upToDate: boolean; unpaidMonths: string[] }> => {
    const payments = await paymentService.getPaymentsByMember(memberId);
    const unpaidPayments = payments.filter(payment => !payment.isPaid);
    const unpaidMonths = unpaidPayments.map(payment => payment.month);
    
    return {
      upToDate: unpaidPayments.length === 0,
      unpaidMonths,
    };
  },

  getMonthlyRecord: async (month: string, year: number): Promise<MonthlyRecord> => {
    const payments = await paymentService.getPaymentsByMonth(month, year);
    const members = await memberService.getAllMembers();
    const totalMembers = members.length;
    
    const paidMembers = new Set(
      payments.filter(p => p.isPaid).map(p => p.memberId)
    ).size;
    
    const unpaidMembers = totalMembers - paidMembers;
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const collectedAmount = payments
      .filter(p => p.isPaid)
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      month,
      year,
      totalMembers,
      paidMembers,
      unpaidMembers,
      totalAmount,
      collectedAmount,
    };
  },

  generatePendingPaymentsForMonth: async (month: string, year: number, amount: number = 100): Promise<number> => {
    try {
      const members = await memberService.getAllMembers();
      const activeMembersIds = members
        .filter(member => member.status === 'frequentante')
        .map(member => member.id);
      
      const existingPayments = await paymentService.getPaymentsByMonth(month, year);
      const membersWithPayments = new Set(existingPayments.map(payment => payment.memberId));
      
      const membersWithoutPayments = activeMembersIds.filter(id => !membersWithPayments.has(id));
      
      const newPayments = membersWithoutPayments.map(memberId => ({
        member_id: memberId,
        amount: amount,
        payment_date: null,
        month: month,
        year: year,
        is_paid: false,
        payment_method: null,
        notes: "Gerado automaticamente"
      }));
      
      if (newPayments.length === 0) {
        return 0;
      }
      
      const { error } = await supabase
        .from('payments')
        .insert(newPayments);
      
      if (error) {
        console.error('Erro ao gerar pagamentos pendentes:', error);
        throw error;
      }
      
      return newPayments.length;
    } catch (error) {
      console.error('Erro ao gerar pagamentos pendentes:', error);
      throw error;
    }
  }
};

// Utility functions
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatMonthYear = (monthStr: string): string => {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
};

export const getCurrentMonthYear = (): { month: string; year: number } => {
  const date = new Date();
  const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
  const year = date.getFullYear();
  return { month, year };
};

export const getStatusLabel = (status: MemberStatus): string => {
  const statusMap: Record<MemberStatus, string> = {
    frequentante: "Frequentante",
    afastado: "Afastado",
    advertido: "Advertido",
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: MemberStatus): string => {
  const statusMap: Record<MemberStatus, string> = {
    frequentante: "bg-green-500",
    afastado: "bg-amber-500",
    advertido: "bg-red-500",
  };
  return statusMap[status] || "bg-gray-500";
};
