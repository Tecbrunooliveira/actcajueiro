
import { useState, useEffect, useCallback } from "react";
import { useMemberStatusData } from "./report360/useMemberStatusData";
import { usePaymentStatusData } from "./report360/usePaymentStatusData";
import { useExpensesData } from "./report360/useExpensesData";
import { useFinancialSummary } from "./report360/useFinancialSummary";
import { useToast } from "@/components/ui/use-toast";

// Persistent cache between page renderings
const globalCachedData = {
  memberStatus: null,
  paymentStatus: null,
  expenses: null,
  financialSummary: null
};

export const useReport360Data = (selectedMonth: string, selectedYear: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Only load data if tab is active to improve performance
  const isActiveTab = selectedMonth && selectedYear;
  
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
    if (memberStatusData.length > 0) globalCachedData.memberStatus = memberStatusData;
    if (paymentStatusData.length > 0) globalCachedData.paymentStatus = paymentStatusData;
    if (expensesData.length > 0) globalCachedData.expenses = expensesData;
    if (financialSummary.totalIncome !== undefined) globalCachedData.financialSummary = financialSummary;
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

  // Combine all errors
  useEffect(() => {
    // If not on active tab, clear errors
    if (!isActiveTab) {
      setError(null);
      return;
    }
    
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
  }, [memberError, paymentError, expensesError, financialError, isActiveTab]);

  // Improve loading state management
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
        // If we have cached data, show immediately and continue loading in background
        setLoading(false);
      }
      
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
        }, 200); // Reduced from 300ms
        
        return () => clearTimeout(timer);
      }
      
      // Add safety timeout to avoid infinite loading state
      const timer = setTimeout(() => {
        if (loading) {
          setLoading(false);
          if (!error) {
            setError("Tempo limite excedido ao carregar os dados. Tente novamente.");
          }
        }
      }, 5000); // Reduced from 7 seconds to 5 seconds
      
      return () => clearTimeout(timer);
      
    } catch (err) {
      console.error("Error in Report360 data loading:", err);
      setError("Erro ao carregar dados do relatório 360°");
      setLoading(false);
    }
  }, [memberStatusData, paymentStatusData, expensesData, financialSummary, 
      memberError, paymentError, expensesError, financialError, loading, error, isActiveTab]);

  // Retry function with better performance
  const retry = useCallback(() => {
    if (!isActiveTab) return;
    
    setLoading(true);
    setError(null);
    setIsRetrying(true);
    
    // Show toast notification
    toast({
      title: "Recarregando dados",
      description: "Tentando buscar os dados novamente...",
    });
    
    // Try to fetch all data again in parallel
    Promise.all([
      retryMemberData(),
      retryPaymentData(),
      retryExpensesData(),
      retryFinancialData()
    ]).catch(e => {
      console.error("Error during retry:", e);
    }).finally(() => {
      setIsRetrying(false);
    });
    
    // Add shorter safety timeout for retry operation
    setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 5000); // Reduced to 5 seconds
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
