
import { useState, useEffect } from "react";
import { useMemberStatusData } from "./report360/useMemberStatusData";
import { usePaymentStatusData } from "./report360/usePaymentStatusData";
import { useExpensesData } from "./report360/useExpensesData";
import { useFinancialSummary } from "./report360/useFinancialSummary";

export const useReport360Data = (selectedMonth: string, selectedYear: string) => {
  const [loading, setLoading] = useState(true);
  
  // Use our smaller hooks
  const { memberStatusData } = useMemberStatusData();
  const { paymentStatusData } = usePaymentStatusData(selectedMonth, selectedYear);
  const { expensesData } = useExpensesData(selectedMonth, selectedYear);
  const { financialSummary } = useFinancialSummary(selectedMonth, selectedYear);

  // Handle loading state
  useEffect(() => {
    if (
      memberStatusData.length > 0 &&
      paymentStatusData.length > 0 &&
      (expensesData.length > 0 || true) && // Allow empty expenses data
      financialSummary.totalIncome !== undefined
    ) {
      setLoading(false);
    }
  }, [memberStatusData, paymentStatusData, expensesData, financialSummary]);

  return {
    loading,
    memberStatusData,
    paymentStatusData,
    expensesData,
    financialSummary
  };
};
