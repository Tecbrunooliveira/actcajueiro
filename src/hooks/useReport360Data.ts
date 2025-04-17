
import { useState, useEffect, useCallback } from "react";
import { useMemberStatusData } from "./report360/useMemberStatusData";
import { usePaymentStatusData } from "./report360/usePaymentStatusData";
import { useExpensesData } from "./report360/useExpensesData";
import { useFinancialSummary } from "./report360/useFinancialSummary";
import { useToast } from "@/components/ui/use-toast";

export const useReport360Data = (selectedMonth: string, selectedYear: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Increase the timeout for first load
  const [retryCount, setRetryCount] = useState(0);
  
  // Use our smaller hooks with enhanced error handling
  const { memberStatusData, error: memberError, retry: retryMemberData } = useMemberStatusData();
  const { paymentStatusData, error: paymentError, retry: retryPaymentData } = usePaymentStatusData(selectedMonth, selectedYear);
  const { expensesData, error: expensesError, retry: retryExpensesData } = useExpensesData(selectedMonth, selectedYear);
  const { financialSummary, error: financialError, retry: retryFinancialData } = useFinancialSummary(selectedMonth, selectedYear);

  // Combine all errors
  useEffect(() => {
    const errors = [memberError, paymentError, expensesError, financialError].filter(Boolean);
    
    if (errors.length > 0) {
      // Prioritize showing timeout errors
      const timeoutError = errors.find(err => 
        err?.toLowerCase().includes("tempo limite") || 
        err?.toLowerCase().includes("timeout")
      );
      
      if (timeoutError) {
        setError("Tempo limite excedido. O servidor está demorando para responder.");
      } else {
        setError(errors[0] || "Erro ao carregar dados do relatório 360°");
      }
    } else {
      setError(null);
    }
  }, [memberError, paymentError, expensesError, financialError]);

  // Handle loading state with fallback
  useEffect(() => {
    try {
      // Update to handle partial data loading
      const hasPartialData = 
        (memberStatusData.length > 0 || expensesData.length > 0 || 
         paymentStatusData.length > 0 || financialSummary.totalIncome !== undefined);
      
      // Set loading to false after timeout or when we have some data to show
      if (hasPartialData) {
        setLoading(false);
      } else if (!hasPartialData && (memberError || paymentError || expensesError || financialError)) {
        // If we have errors and no data, stop loading
        setLoading(false);
      }
      
      // Add safety timeout to prevent infinite loading state
      const timer = setTimeout(() => {
        if (loading) {
          setLoading(false);
          if (!error) {
            setError("Tempo limite excedido ao carregar os dados. Tente novamente.");
          }
        }
      }, 10000); // 10 second safety timeout
      
      return () => clearTimeout(timer);
      
    } catch (err) {
      console.error("Error in Report360 data loading:", err);
      setError("Erro ao carregar dados do relatório 360°");
      setLoading(false);
    }
  }, [memberStatusData, paymentStatusData, expensesData, financialSummary, 
      memberError, paymentError, expensesError, financialError, loading, error]);

  // Add retry function to refresh all data
  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
    
    // Retry all data fetching
    retryMemberData();
    retryPaymentData();
    retryExpensesData();
    retryFinancialData();
    
    toast({
      title: "Recarregando dados",
      description: "Tentando buscar os dados novamente...",
    });
    
    // Add safety timeout for retry operation
    setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 15000); // 15 second timeout for retry
  }, [retryMemberData, retryPaymentData, retryExpensesData, retryFinancialData, toast, loading]);

  return {
    loading,
    memberStatusData,
    paymentStatusData,
    expensesData,
    financialSummary,
    error,
    retry
  };
};
