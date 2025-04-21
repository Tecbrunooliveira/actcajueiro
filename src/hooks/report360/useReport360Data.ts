
import { useState, useCallback, useEffect } from "react";
import { useMemberStatusData } from "./useMemberStatusData";
import { usePaymentStatusData } from "./usePaymentStatusData";
import { useExpensesData } from "./useExpensesData";
import { useFinancialSummary } from "./useFinancialSummary";
import { useToast } from "@/components/ui/use-toast";

export const useReport360Data = (selectedMonth: string, selectedYear: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Verifica se temos mês e ano válidos antes de prosseguir
  const hasValidSelection = selectedMonth && selectedYear;
  
  // Use smaller hooks with optimized loading
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

  // Set loading state to false once initial data fetch is complete
  useEffect(() => {
    if (!hasValidSelection) {
      setLoading(false);
    } else if (!isPaymentRetrying && !isExpensesRetrying && !isFinancialRetrying) {
      setLoading(false);
    }
  }, [hasValidSelection, isPaymentRetrying, isExpensesRetrying, isFinancialRetrying]);

  // Monitor if any hook is retrying
  useEffect(() => {
    setIsRetrying(
      isMemberRetrying || 
      isPaymentRetrying || 
      isExpensesRetrying || 
      isFinancialRetrying
    );
  }, [isMemberRetrying, isPaymentRetrying, isExpensesRetrying, isFinancialRetrying]);

  // Combine all errors with improved prioritization
  useEffect(() => {
    const errors = [memberError, paymentError, expensesError, financialError].filter(Boolean);
    
    if (errors.length > 0) {
      // First prioritize DB errors
      const dbError = errors.find(err => 
        err?.toLowerCase().includes("database") || 
        err?.toLowerCase().includes("syntax") ||
        err?.toLowerCase().includes("statement")
      );
      
      if (dbError) {
        setError(dbError);
        return;
      }
      
      // Then prioritize timeout errors
      const timeoutError = errors.find(err => 
        err?.toLowerCase().includes("tempo limite") || 
        err?.toLowerCase().includes("timeout") ||
        err?.toLowerCase().includes("demorando")
      );
      
      if (timeoutError) {
        setError("Tempo limite excedido. O servidor está demorando para responder.");
        return;
      }
      
      // Finally, use the first error
      setError(errors[0] || "Erro ao carregar dados do relatório 360°");
    } else {
      setError(null);
    }
  }, [memberError, paymentError, expensesError, financialError]);

  // Enhance retry function with better error handling and parallel requests
  const retry = useCallback(() => {
    if (!hasValidSelection) {
      toast({
        title: "Informação necessária",
        description: "Selecione um mês e ano antes de carregar o relatório.",
        duration: 3000,
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    setIsRetrying(true);
    
    // Show toast notification
    toast({
      title: "Recarregando dados",
      description: "Tentando buscar os dados novamente...",
      duration: 3000,
    });
    
    // Try to fetch all data again in parallel with individual error handling
    Promise.allSettled([
      retryMemberData().catch(e => console.error("Member retry error:", e)),
      retryPaymentData().catch(e => console.error("Payment retry error:", e)),
      retryExpensesData().catch(e => console.error("Expenses retry error:", e)),
      retryFinancialData().catch(e => console.error("Financial retry error:", e))
    ]).then(results => {
      // Check if any requests succeeded
      const anySuccess = results.some(r => r.status === 'fulfilled');
      
      if (!anySuccess) {
        toast({
          title: "Falha ao recuperar dados",
          description: "Não foi possível obter dados atualizados. Usando dados em cache quando disponíveis.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }).finally(() => {
      setIsRetrying(false);
      setLoading(false);
    });
  }, [retryMemberData, retryPaymentData, retryExpensesData, retryFinancialData, toast, hasValidSelection]);

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
