
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
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Use our smaller hooks with enhanced error handling
  const { 
    memberStatusData, 
    error: memberError, 
    retry: retryMemberData,
    isRetrying: isMemberRetrying
  } = useMemberStatusData();
  
  const { 
    paymentStatusData, 
    error: paymentError, 
    retry: retryPaymentData,
    isRetrying: isPaymentRetrying
  } = usePaymentStatusData(selectedMonth, selectedYear);
  
  const { 
    expensesData, 
    error: expensesError, 
    retry: retryExpensesData,
    isRetrying: isExpensesRetrying
  } = useExpensesData(selectedMonth, selectedYear);
  
  const { 
    financialSummary, 
    error: financialError, 
    retry: retryFinancialData,
    isRetrying: isFinancialRetrying
  } = useFinancialSummary(selectedMonth, selectedYear);

  // Track if any hook is currently retrying
  useEffect(() => {
    setIsRetrying(
      isMemberRetrying || 
      isPaymentRetrying || 
      isExpensesRetrying || 
      isFinancialRetrying
    );
  }, [isMemberRetrying, isPaymentRetrying, isExpensesRetrying, isFinancialRetrying]);

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
        // If we have errors and no data, stop loading after a short delay
        const timer = setTimeout(() => {
          setLoading(false);
        }, 500);
        
        return () => clearTimeout(timer);
      }
      
      // Add safety timeout to prevent infinite loading state
      const timer = setTimeout(() => {
        if (loading) {
          setLoading(false);
          if (!error) {
            setError("Tempo limite excedido ao carregar os dados. Tente novamente.");
          }
        }
      }, 20000); // 20 second safety timeout (increased from 10s)
      
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
    
    // Show a toast notification
    toast({
      title: "Recarregando dados",
      description: "Tentando buscar os dados novamente...",
    });
    
    // Retry all data fetching
    Promise.all([
      retryMemberData(),
      retryPaymentData(),
      retryExpensesData(),
      retryFinancialData()
    ]).catch(e => {
      console.error("Error during retry:", e);
    });
    
    // Add safety timeout for retry operation
    setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 25000); // 25 second timeout for retry (increased from 15s)
  }, [retryMemberData, retryPaymentData, retryExpensesData, retryFinancialData, toast, loading]);

  return {
    loading,
    isRetrying,
    memberStatusData,
    paymentStatusData,
    expensesData,
    financialSummary,
    error,
    retry
  };
};
