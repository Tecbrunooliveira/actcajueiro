
import { useState, useEffect } from "react";
import { Payment } from "@/types";
import { paymentService } from "@/services";

// Import our new hooks
import { usePeriodSelection } from "./reports/usePeriodSelection";
import { useMemberPaymentStatus } from "./reports/useMemberPaymentStatus";
import { useMonthlyRecord } from "./reports/useMonthlyRecord";
import { usePaymentGeneration } from "./reports/usePaymentGeneration";
import { usePdfReportGeneration } from "./reports/usePdfReportGeneration";

export const useReportsData = () => {
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [monthlyPayments, setMonthlyPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

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

  const { monthlyRecord } = useMonthlyRecord(selectedMonth, selectedYear);

  // Define the data refresh function
  const refreshData = async () => {
    try {
      setLoading(true);
      
      // Fetch payments data
      const fetchedPayments = await paymentService.getAllPayments();
      setAllPayments(fetchedPayments);
      
      // Filter payments by selected month
      const monthPayments = fetchedPayments.filter(
        (payment) => payment.month === selectedMonth
      );
      setMonthlyPayments(monthPayments);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle payments data loading
  useEffect(() => {
    refreshData();
  }, [selectedMonth, selectedYear]);

  // Use member status hook
  const { allMembers, paidMembers, unpaidMembers } = useMemberPaymentStatus(selectedMonth, allPayments);

  // Use payment generation hook
  const { generatingPayments, handleGeneratePendingPayments } = 
    usePaymentGeneration(selectedMonth, selectedYear, refreshData);

  // Use PDF report generation hook
  const { generatingPdf, handleGeneratePdfReport } = 
    usePdfReportGeneration(selectedMonth, paidMembers, unpaidMembers);

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
    loading,
    generatingPayments,
    generatingPdf,
    
    // Actions
    handleGeneratePendingPayments,
    handleGeneratePdfReport,
    formatMonthYear
  };
};
