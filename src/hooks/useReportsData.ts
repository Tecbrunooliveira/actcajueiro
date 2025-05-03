
import { useState, useEffect, useCallback } from "react";
import { Payment } from "@/types";
import { paymentService } from "@/services";
import { useQuery } from '@tanstack/react-query';

// Import our new hooks
import { usePeriodSelection } from "./reports/usePeriodSelection";
import { useMemberPaymentStatus } from "./reports/useMemberPaymentStatus";
import { useMonthlyRecord } from "./reports/useMonthlyRecord";
import { usePaymentGeneration } from "./reports/usePaymentGeneration";
import { usePdfReportGeneration } from "./reports/usePdfReportGeneration";
import { useToast } from "@/components/ui/use-toast";

export const useReportsData = (retryCount: number = 0) => {
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [monthlyPayments, setMonthlyPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Get monthly record with optimized loading but only when explicitly triggered
  const { 
    monthlyRecord, 
    loadingMonthlyRecord, 
    error: monthlyRecordError,
    retry: retryMonthlyRecord
  } = useMonthlyRecord(selectedMonth, selectedYear, retryCount > 0);

  // Define the data refresh function with error handling and optimized loading
  const refreshData = useCallback(async () => {
    if (!selectedMonth) {
      console.log("No month selected, skipping data refresh");
      return;
    }
    
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

  // Only load data when retryTrigger changes (search button clicked)
  useEffect(() => {
    if (retryCount > 0) {
      console.log("Loading data due to retry trigger:", retryCount);
      refreshData();
    }
  }, [refreshData, retryCount]);

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
  
  // Usado para buscar dados quando o período muda
  const { data, isLoading: loadingReport, error: reportError, refetch } = useQuery({
    queryKey: ['reports', selectedMonth, selectedYear, retryCount],
    queryFn: async () => {
      // Aqui você pode compor as chamadas necessárias (pagamentos, membros, etc)
      // Exemplo: buscar pagamentos do mês/ano
      const payments = await paymentService.getAllPayments();
      return {
        payments,
        // ...outros dados
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    enabled: Boolean(selectedMonth) && Boolean(selectedYear)
  });
  
  // Function to retry data loading
  const handleRetry = () => {
    refetch();
    
    // Also retry individual data parts
    if (retryMonthlyRecord) retryMonthlyRecord();
    if (retryMembers) retryMembers();
  };
  
  return {
    selectedMonth,
    selectedYear,
    monthOptions,
    yearOptions,
    handleMonthChange,
    handleYearChange,
    monthlyRecord,
    allMembers,
    unpaidMembers,
    paidMembers,
    loading: isLoading,
    dataError: reportError ? String(reportError) : null,
    generatingPayments,
    generatingPdf,
    handleGeneratePendingPayments,
    handleGeneratePdfReport,
    formatMonthYear,
    handleRetry
  };
};
