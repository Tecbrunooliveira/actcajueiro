
import { Payment } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Reusable timeout promise for more reliable error handling
const createTimeoutPromise = (timeoutMs = 10000) => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Tempo limite excedido ao buscar dados."));
    }, timeoutMs);
  });
};

// Transform database rows to Payment objects
const mapToPaymentModel = (payment: any): Payment => ({
  id: payment.id,
  memberId: payment.member_id,
  amount: payment.amount,
  date: payment.payment_date || "",
  month: payment.month,
  year: payment.year,
  isPaid: payment.is_paid,
  paymentMethod: payment.payment_method || undefined,
  notes: payment.notes || undefined,
});

export const paymentQueryService = {
  getPaymentsByMember: async (memberId: string): Promise<Payment[]> => {
    try {
      if (!memberId) {
        console.error('Invalid member ID:', memberId);
        return [];
      }

      // Create a timeout promise that will reject after 10 seconds
      const fetchPromise = supabase
        .from('payments')
        .select('*')
        .eq('member_id', memberId);
      
      // Race the fetch against the timeout
      const { data, error } = await Promise.race([
        fetchPromise,
        createTimeoutPromise().then(() => ({ data: null, error: new Error("Tempo limite excedido") }))
      ]);
      
      if (error) {
        console.error('Error fetching payments by member:', error);
        return [];
      }
      
      return data?.map(mapToPaymentModel) || [];
    } catch (error) {
      console.error('Exception fetching payments by member:', error);
      return [];
    }
  },

  getPaymentsByMonth: async (month: string, year: number): Promise<Payment[]> => {
    try {
      // Enhanced input validation
      if (!month || typeof month !== 'string' || month.trim() === '') {
        console.error('Invalid month input:', month);
        return [];
      }
      
      if (typeof year !== 'number' || isNaN(year) || year < 2000 || year > 2100) {
        console.error('Invalid year input:', year);
        return [];
      }
      
      // Use the timeout pattern consistently
      const fetchPromise = supabase
        .from('payments')
        .select('*')
        .eq('month', month)
        .eq('year', year);
      
      // Race the fetch against the timeout
      const { data, error } = await Promise.race([
        fetchPromise,
        createTimeoutPromise().then(() => ({ data: null, error: new Error("Tempo limite excedido") }))
      ]);
      
      if (error) {
        console.error('Error fetching payments by month:', error);
        return [];
      }
      
      return data?.map(mapToPaymentModel) || [];
    } catch (error) {
      console.error('Exception fetching payments by month:', error);
      return [];
    }
  },

  getPaidPayments: async (): Promise<Payment[]> => {
    try {
      // Use the timeout pattern consistently
      const fetchPromise = supabase
        .from('payments')
        .select('*')
        .eq('is_paid', true);
      
      // Race the fetch against the timeout
      const { data, error } = await Promise.race([
        fetchPromise,
        createTimeoutPromise().then(() => ({ data: null, error: new Error("Tempo limite excedido") }))
      ]);
      
      if (error) {
        console.error('Error fetching paid payments:', error);
        return [];
      }
      
      return data?.map(mapToPaymentModel) || [];
    } catch (error) {
      console.error('Exception fetching paid payments:', error);
      return [];
    }
  },

  getUnpaidPayments: async (): Promise<Payment[]> => {
    try {
      // Use the timeout pattern consistently
      const fetchPromise = supabase
        .from('payments')
        .select('*')
        .eq('is_paid', false);
      
      // Race the fetch against the timeout
      const { data, error } = await Promise.race([
        fetchPromise,
        createTimeoutPromise().then(() => ({ data: null, error: new Error("Tempo limite excedido") }))
      ]);
      
      if (error) {
        console.error('Error fetching unpaid payments:', error);
        return [];
      }
      
      return data?.map(mapToPaymentModel) || [];
    } catch (error) {
      console.error('Exception fetching unpaid payments:', error);
      return [];
    }
  },

  // New helper method for better caching and prefetching
  getAllPaymentsWithRetry: async (maxRetries = 2): Promise<Payment[]> => {
    let retries = 0;
    let lastError = null;

    while (retries <= maxRetries) {
      try {
        const fetchPromise = supabase
          .from('payments')
          .select('*')
          .order('year', { ascending: false })
          .order('month', { ascending: false });
        
        // Increased timeout for the first fetch but shorter for retries
        const timeoutMs = retries === 0 ? 15000 : 7000;
        
        // Race the fetch against the timeout
        const { data, error } = await Promise.race([
          fetchPromise,
          createTimeoutPromise(timeoutMs).then(() => ({ 
            data: null, 
            error: new Error(`Tempo limite excedido (tentativa ${retries + 1})`) 
          }))
        ]);
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          throw new Error("Nenhum dado recebido do servidor");
        }
        
        return data.map(mapToPaymentModel);
      } catch (error) {
        console.error(`Payment fetch attempt ${retries + 1} failed:`, error);
        lastError = error;
        retries++;
        
        // Add a small delay before retrying
        if (retries <= maxRetries) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
    
    console.error('All payment fetch attempts failed:', lastError);
    return [];
  }
};
