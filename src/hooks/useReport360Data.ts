
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
  
  // Use our smaller hooks with enhanced error handling
  const { memberStatusData, error: memberError, retry: retryMemberData } = useMemberStatusData();
  const { paymentStatusData, error: paymentError, retry: retryPaymentData } = usePaymentStatusData(selectedMonth, selectedYear);
  const { expensesData, error: expensesError, retry: retryExpensesData } = useExpensesData(selectedMonth, selectedYear);
  const { financialSummary, error: financialError, retry: retryFinancialData } = useFinancialSummary(selectedMonth, selectedYear);

  // Combine all errors
  useEffect(() => {
    const errors = [memberError, paymentError, expensesError, financialError].filter(Boolean);
    
    if (errors.length > 0) {
      setError(errors[0] || "Erro ao carregar dados do relatório 360°");
    } else {
      setError(null);
    }
  }, [memberError, paymentError, expensesError, financialError]);

  // Handle loading state
  useEffect(() => {
    try {
      // Consider data loaded when we have the essential pieces
      // Allow some data to be missing but still show the report
      if ((memberStatusData.length > 0 || memberError) &&
          (paymentStatusData.length > 0 || paymentError) &&
          (financialSummary.totalIncome !== undefined || financialError)) {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error in Report360 data loading:", err);
      setError("Erro ao carregar dados do relatório 360°");
      setLoading(false);
    }
  }, [memberStatusData, paymentStatusData, expensesData, financialSummary, 
      memberError, paymentError, expensesError, financialError]);

  // Add retry function to refresh all data
  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    
    // Retry all data fetching
    retryMemberData();
    retryPaymentData();
    retryExpensesData();
    retryFinancialData();
    
    // After a short delay, check if we're still having issues
    setTimeout(() => {
      if (error) {
        toast({
          title: "Erro ao recarregar dados",
          description: "Não foi possível atualizar os dados do relatório 360°.",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 1000);
  }, [error, toast, retryMemberData, retryPaymentData, retryExpensesData, retryFinancialData]);

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
