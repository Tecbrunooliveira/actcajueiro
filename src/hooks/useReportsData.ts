
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

export const useReportsData = () => {
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
  const { monthlyRecord, loadingMonthlyRecord } = useMonthlyRecord(selectedMonth, selectedYear);

  // Define the data refresh function with error handling and optimized loading
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setDataError(null);
      
      // Fetch payments data with timeout handling
      const fetchedPayments = await paymentService.getAllPayments();
      setAllPayments(fetchedPayments);
      
      // Filter payments by selected month - do this client-side to reduce server load
      const monthPayments = fetchedPayments.filter(
        (payment) => payment.month === selectedMonth
      );
      setMonthlyPayments(monthPayments);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setDataError("Erro ao carregar dados de pagamentos");
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
  const { allMembers, paidMembers, unpaidMembers, loadingMembers } = 
    useMemberPaymentStatus(selectedMonth, allPayments);

  // Handle payments data loading with optimized approach
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Use payment generation hook
  const { generatingPayments, handleGeneratePendingPayments } = 
    usePaymentGeneration(selectedMonth, selectedYear, refreshData);

  // Use PDF report generation hook
  const { generatingPdf, handleGeneratePdfReport } = 
    usePdfReportGeneration(selectedMonth, paidMembers, unpaidMembers);

  // Calculate combined loading state
  const isLoading = loading || loadingMonthlyRecord || loadingMembers;

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
    formatMonthYear
  };
};
