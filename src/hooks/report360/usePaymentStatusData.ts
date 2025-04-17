
import { useState, useEffect, useCallback } from "react";
import { paymentService } from "@/services";

export const usePaymentStatusData = (selectedMonth: string, selectedYear: string) => {
  const [paymentStatusData, setPaymentStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  
  const fetchPaymentStatusData = useCallback(async () => {
    try {
      setError(null);
      setFetchAttempted(true);
      
      // Use a shorter timeout to improve UX
      const fetchPromise = paymentService.getMonthlyRecord(
        selectedMonth,
        parseInt(selectedYear)
      );
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar dados de pagamento.")), 8000)
      );
      
      // Race the fetch against a timeout
      const monthlyRecord = await Promise.race([fetchPromise, timeoutPromise]);
      
      // Add a fallback in case the response is empty or invalid
      if (!monthlyRecord || typeof monthlyRecord !== 'object') {
        throw new Error("Dados de pagamento inválidos recebidos do servidor.");
      }
      
      // Make sure we have the expected properties
      const paidMembers = monthlyRecord.paidMembers || 0;
      const unpaidMembers = monthlyRecord.unpaidMembers || 0;
      
      const data = [
        { name: 'Em Dia', value: paidMembers, color: '#10b981' },
        { name: 'Inadimplentes', value: unpaidMembers, color: '#ef4444' }
      ];
      
      setPaymentStatusData(data);
    } catch (error) {
      console.error("Error fetching payment status data:", error);
      
      // Set more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("tempo limite") || error.message.includes("timeout")) {
          setError("Erro de tempo limite ao carregar dados de pagamento.");
        } else {
          setError(error.message);
        }
      } else {
        setError("Erro ao carregar dados de pagamento");
      }
      
      // Set default data for a better fallback experience
      if (paymentStatusData.length === 0) {
        setPaymentStatusData([
          { name: 'Em Dia', value: 0, color: '#10b981' },
          { name: 'Inadimplentes', value: 0, color: '#ef4444' }
        ]);
      }
    }
  }, [selectedMonth, selectedYear, paymentStatusData.length]);

  useEffect(() => {
    // Only fetch if we haven't tried yet or if month/year changes
    if (!fetchAttempted || selectedMonth || selectedYear) {
      fetchPaymentStatusData();
    }
  }, [fetchPaymentStatusData, fetchAttempted, selectedMonth, selectedYear]);

  return { 
    paymentStatusData,
    error,
    retry: fetchPaymentStatusData
  };
};
