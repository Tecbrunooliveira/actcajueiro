
import { Payment } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const paymentQueryService = {
  getPaymentsByMember: async (memberId: string): Promise<Payment[]> => {
    try {
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
    } catch (error) {
      console.error('Exception fetching payments by member:', error);
      return [];
    }
  },

  getPaymentsByMonth: async (month: string, year: number): Promise<Payment[]> => {
    try {
      // Validate inputs
      if (!month || typeof year !== 'number' || isNaN(year)) {
        console.error('Invalid month or year input:', { month, year });
        return [];
      }
      
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
    } catch (error) {
      console.error('Exception fetching payments by month:', error);
      return [];
    }
  },

  getPaidPayments: async (): Promise<Payment[]> => {
    try {
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
    } catch (error) {
      console.error('Exception fetching paid payments:', error);
      return [];
    }
  },

  getUnpaidPayments: async (): Promise<Payment[]> => {
    try {
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
    } catch (error) {
      console.error('Exception fetching unpaid payments:', error);
      return [];
    }
  },
};
