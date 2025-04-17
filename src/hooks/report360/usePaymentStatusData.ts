
import { useState, useEffect, useCallback } from "react";
import { paymentService } from "@/services";

export const usePaymentStatusData = (selectedMonth: string, selectedYear: string) => {
  const [paymentStatusData, setPaymentStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPaymentStatusData = useCallback(async () => {
    try {
      setError(null);
      
      // Use a shorter timeout to improve UX
      const fetchPromise = paymentService.getMonthlyRecord(
        selectedMonth,
        parseInt(selectedYear)
      );
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar dados de pagamento.")), 5000)
      );
      
      // Race the fetch against a timeout
      const monthlyRecord = await Promise.race([fetchPromise, timeoutPromise]);
      
      const data = [
        { name: 'Em Dia', value: monthlyRecord.paidMembers, color: '#10b981' },
        { name: 'Inadimplentes', value: monthlyRecord.unpaidMembers, color: '#ef4444' }
      ];
      
      setPaymentStatusData(data);
    } catch (error) {
      console.error("Error fetching payment status data:", error);
      setError(error instanceof Error ? error.message : "Erro ao carregar dados de pagamento");
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchPaymentStatusData();
  }, [fetchPaymentStatusData]);

  return { 
    paymentStatusData,
    error,
    retry: fetchPaymentStatusData
  };
};
