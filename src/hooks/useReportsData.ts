
import { useState, useEffect, useCallback } from "react";
import { Payment } from "@/types";
import { paymentService } from "@/services";

// Import our new hooks
import { usePeriodSelection } from "./reports/usePeriodSelection";
import { useMemberPaymentStatus } from "./reports/useMemberPaymentStatus";
import { useMonthlyRecord } from "./reports/useMonthlyRecord";
import { usePaymentGeneration } from "./reports/usePaymentGeneration";
import { usePdfReportGeneration } from "./reports/usePdfReportGeneration";
import { useToast } from "@/components/ui/use-toast";

export const useReportsData = (retryTrigger = 0) => {
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [monthlyPayments, setMonthlyPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const { toast } = useToast();

  // Use our smaller hooks
  const {
    selectedMonth,
    selectedYear,
    monthOptions,
    yearOptions,
    handleMonthChange,
    handleYearChange,
    formatMonthYear
  } = usePeriodSelection();

  // Get monthly record with optimized loading
  const { 
    monthlyRecord, 
    loadingMonthlyRecord, 
    error: monthlyRecordError,
    retry: retryMonthlyRecord
  } = useMonthlyRecord(selectedMonth, selectedYear);

  // Define the data refresh function with error handling and optimized loading
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setDataError(null);
      
      // Shorter timeout for better UX
      const fetchPromise = paymentService.getAllPayments();
      const timeoutPromise = new Promise<Payment[]>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar pagamentos.")), 5000)
      );
      
      // Race the fetch against a timeout
      const fetchedPayments = await Promise.race([fetchPromise, timeoutPromise]);
      setAllPayments(fetchedPayments);
      
      // Filter payments by selected month - do this client-side to reduce server load
      const monthPayments = fetchedPayments.filter(
        (payment) => payment.month === selectedMonth
      );
      setMonthlyPayments(monthPayments);
    } catch (error) {
      console.error("Error refreshing data:", error);
      
      // Set an appropriate error message
      const errorMessage = error instanceof Error
        ? error.message
        : "Erro ao carregar dados de pagamentos. Tente novamente.";
      
      setDataError(errorMessage);
      
      toast({
        title: "Erro ao carregar dados",
        description: "Houve um problema ao buscar os pagamentos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, toast]);

  // Use member status hook with lazy loading
  const { 
    allMembers, 
    paidMembers, 
    unpaidMembers, 
    loadingMembers,
    error: membersError,
    retry: retryMembers
  } = useMemberPaymentStatus(selectedMonth, allPayments);

  // Handle payments data loading with optimized approach
  useEffect(() => {
    refreshData();
  }, [refreshData, retryTrigger]);

  // Combine errors
  useEffect(() => {
    if (monthlyRecordError || membersError) {
      setDataError(monthlyRecordError || membersError || "Erro ao carregar dados");
    }
  }, [monthlyRecordError, membersError]);

  // Use payment generation hook
  const { generatingPayments, handleGeneratePendingPayments } = 
    usePaymentGeneration(selectedMonth, selectedYear, refreshData);

  // Use PDF report generation hook
  const { generatingPdf, handleGeneratePdfReport } = 
    usePdfReportGeneration(selectedMonth, paidMembers, unpaidMembers);

  // Calculate combined loading state
  const isLoading = loading || loadingMonthlyRecord || loadingMembers;
  
  // Combined retry function
  const handleRetry = useCallback(() => {
    setDataError(null);
    refreshData();
    retryMonthlyRecord?.();
    retryMembers?.();
  }, [refreshData, retryMonthlyRecord, retryMembers]);

  return {
    // Period selection
    selectedMonth,
    selectedYear,
    monthOptions,
    yearOptions,
    handleMonthChange,
    handleYearChange,
    
    // Data
    monthlyRecord,
    allMembers,
    unpaidMembers,
    paidMembers,
    
    // State
    loading: isLoading,
    dataError,
    generatingPayments,
    generatingPdf,
    
    // Actions
    handleGeneratePendingPayments,
    handleGeneratePdfReport,
    formatMonthYear,
    retry: handleRetry
  };
};
