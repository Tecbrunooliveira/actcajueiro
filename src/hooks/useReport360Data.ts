
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
  
  // Use our smaller hooks
  const { memberStatusData } = useMemberStatusData();
  const { paymentStatusData } = usePaymentStatusData(selectedMonth, selectedYear);
  const { expensesData } = useExpensesData(selectedMonth, selectedYear);
  const { financialSummary } = useFinancialSummary(selectedMonth, selectedYear);

  // Handle loading state
  useEffect(() => {
    try {
      if (
        memberStatusData.length > 0 &&
        paymentStatusData.length > 0 &&
        (expensesData.length > 0 || true) && // Allow empty expenses data
        financialSummary.totalIncome !== undefined
      ) {
        setLoading(false);
        setError(null);
      }
    } catch (err) {
      console.error("Error in Report360 data loading:", err);
      setError("Erro ao carregar dados do relatório 360°");
      setLoading(false);
    }
  }, [memberStatusData, paymentStatusData, expensesData, financialSummary]);

  // Add retry function to refresh data
  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    
    // Force re-evaluation of the data hooks by triggering a re-render
    setTimeout(() => {
      if (!memberStatusData.length || !paymentStatusData.length || financialSummary.totalIncome === undefined) {
        toast({
          title: "Erro ao recarregar dados",
          description: "Não foi possível atualizar os dados do relatório 360°.",
          variant: "destructive"
        });
        setError("Erro ao recarregar dados do relatório 360°");
      }
      setLoading(false);
    }, 1000);
  }, [memberStatusData, paymentStatusData, expensesData, financialSummary, toast]);

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
