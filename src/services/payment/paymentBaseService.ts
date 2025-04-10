
import { Payment } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const paymentBaseService = {
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
};
