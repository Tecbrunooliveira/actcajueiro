
import { useState, useEffect, useCallback } from "react";
import { useMemberStatusData } from "./report360/useMemberStatusData";
import { usePaymentStatusData } from "./report360/usePaymentStatusData";
import { useExpensesData } from "./report360/useExpensesData";
import { useFinancialSummary } from "./report360/useFinancialSummary";
import { useToast } from "@/components/ui/use-toast";

// Robust persistent cache between page loads
const globalCachedData = {
  memberStatus: null,
  paymentStatus: null,
  expenses: null,
  financialSummary: null,
  lastUpdated: Date.now()
};

export const useReport360Data = (selectedMonth: string, selectedYear: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Only load data if tab is active to improve performance
  const isActiveTab = !!(selectedMonth && selectedYear);
  
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
  } = usePaymentStatusData(isActiveTab ? selectedMonth : '', isActiveTab ? selectedYear : '');
  
  const { 
    expensesData, 
    error: expensesError, 
    retry: retryExpensesData,
    isRetrying: isExpensesRetrying
  } = useExpensesData(isActiveTab ? selectedMonth : '', isActiveTab ? selectedYear : '');
  
  const { 
    financialSummary, 
    error: financialError, 
    retry: retryFinancialData,
    isRetrying: isFinancialRetrying
  } = useFinancialSummary(isActiveTab ? selectedMonth : '', isActiveTab ? selectedYear : '');

  // Update global cache when data is available
  useEffect(() => {
    // Only update cache if we have valid data
    let cacheUpdated = false;
    
    if (memberStatusData.length > 0) {
      globalCachedData.memberStatus = memberStatusData;
      cacheUpdated = true;
    }
    
    if (paymentStatusData.length > 0) {
      globalCachedData.paymentStatus = paymentStatusData;
      cacheUpdated = true;
    }
    
    if (expensesData.length > 0) {
      globalCachedData.expenses = expensesData;
      cacheUpdated = true;
    }
    
    if (financialSummary.totalIncome !== undefined) {
      globalCachedData.financialSummary = financialSummary;
      cacheUpdated = true;
    }
    
    // Update last updated timestamp if any data was cached
    if (cacheUpdated) {
      globalCachedData.lastUpdated = Date.now();
    }
    
  }, [memberStatusData, paymentStatusData, expensesData, financialSummary]);

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
    // If not on active tab, clear errors
    if (!isActiveTab) {
      setError(null);
      return;
    }
    
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
  }, [memberError, paymentError, expensesError, financialError, isActiveTab]);

  // Improve loading state management with progressive loading
  useEffect(() => {
    // If not on active tab, set as not loading
    if (!isActiveTab) {
      setLoading(false);
      return;
    }
    
    try {
      // Use cached data if available while waiting for new data
      if (globalCachedData.memberStatus && globalCachedData.paymentStatus && 
          globalCachedData.expenses && globalCachedData.financialSummary) {
        // Show cached data immediately while loading in background
        setLoading(false);
      }
      
      // Check if we have partial data available to show
      const hasPartialData = 
        (memberStatusData.length > 0 || expensesData.length > 0 || 
         paymentStatusData.length > 0 || financialSummary.totalIncome !== undefined);
      
      // Stop loading if we have partial data or errors
      if (hasPartialData) {
        setLoading(false);
      } else if (!hasPartialData && (memberError || paymentError || expensesError || financialError)) {
        // Show error state after a short delay
        const timer = setTimeout(() => {
          setLoading(false);
        }, 200);
        
        return () => clearTimeout(timer);
      }
      
      // Add safety timeout to avoid infinite loading state - reduced to 7 seconds
      const timer = setTimeout(() => {
        if (loading) {
          setLoading(false);
          
          // If we have cached data but no new data, show a toast
          if ((globalCachedData.memberStatus || globalCachedData.paymentStatus || 
               globalCachedData.expenses || globalCachedData.financialSummary) && !error) {
            toast({
              title: "Usando dados em cache",
              description: "Mostrando dados anteriores enquanto tentamos obter novos dados.",
              duration: 5000,
            });
          } else if (!error) {
            setError("Tempo limite excedido ao carregar os dados. Tente novamente.");
          }
        }
      }, 7000);
      
      return () => clearTimeout(timer);
      
    } catch (err) {
      console.error("Error in Report360 data loading:", err);
      setError("Erro ao carregar dados do relatório 360°");
      setLoading(false);
    }
  }, [memberStatusData, paymentStatusData, expensesData, financialSummary, 
      memberError, paymentError, expensesError, financialError, loading, error, isActiveTab, toast]);

  // Enhanced retry function with better error handling and parallel requests
  const retry = useCallback(() => {
    if (!isActiveTab) return;
    
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
    });
    
    // Safety timeout for retry operation - 8 seconds
    setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 8000);
  }, [retryMemberData, retryPaymentData, retryExpensesData, retryFinancialData, 
      toast, loading, isActiveTab]);

  return {
    loading,
    isRetrying,
    memberStatusData: memberStatusData.length > 0 ? memberStatusData : (globalCachedData.memberStatus || []),
    paymentStatusData: paymentStatusData.length > 0 ? paymentStatusData : (globalCachedData.paymentStatus || []),
    expensesData: expensesData.length > 0 ? expensesData : (globalCachedData.expenses || []),
    financialSummary: financialSummary.totalIncome !== undefined ? financialSummary : (globalCachedData.financialSummary || { totalIncome: 0, totalExpenses: 0, balance: 0 }),
    error,
    retry
  };
};
