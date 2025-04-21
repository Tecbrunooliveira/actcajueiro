
import { useState, useEffect, useCallback } from "react";
import { Expense } from "@/types";
import { paymentService, expenseService } from "@/services";
import { paymentQueryService } from "@/services/payment/paymentQueryService";

export const useFinancialSummary = (selectedMonth: string, selectedYear: string) => {
  const [financialSummary, setFinancialSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const calculateFinancialSummary = useCallback(async () => {
    // Only calculate if we have month and year selected
    if (!selectedMonth || !selectedYear) {
      console.log("No month/year selected, using default financial summary");
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0
      };
    }
    
    try {
      console.log(`Calculating financial summary for ${selectedMonth}-${selectedYear}`);
      
      // Get the payment data directly from paymentQueryService
      const yearNumber = parseInt(selectedYear);
      const payments = await paymentQueryService.getPaymentsByMonth(selectedMonth, yearNumber);
      
      // Sum up paid payments to calculate total income
      const totalIncome = payments
        .filter(payment => payment.isPaid)
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      console.log(`Calculated totalIncome: ${totalIncome} from ${payments.length} payments`);
      
      // Get expenses for the selected month/year
      const allExpenses = await expenseService.getAllExpenses();
      
      // Filter expenses by month and year
      let totalExpenses = 0;
      
      if (allExpenses && allExpenses.length > 0) {
        const year = parseInt(selectedYear);
        const month = selectedMonth ? parseInt(selectedMonth.split('-')[1]) : 0;
        
        if (year && month) {
          totalExpenses = allExpenses
            .filter(expense => {
              try {
                const expenseDate = new Date(expense.date);
                return expenseDate.getFullYear() === year && expenseDate.getMonth() === month - 1;
              } catch (e) {
                return false; // Skip invalid dates
              }
            })
            .reduce((sum, expense) => sum + (expense.amount || 0), 0);
        }
      }
      
      // Calculate balance
      const balance = totalIncome - totalExpenses;
      
      console.log(`Financial summary calculated: Income: ${totalIncome}, Expenses: ${totalExpenses}, Balance: ${balance}`);
      
      return {
        totalIncome,
        totalExpenses,
        balance
      };
    } catch (error) {
      console.error("Error in calculateFinancialSummary:", error);
      // Return default values on error
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0
      };
    }
  }, [selectedMonth, selectedYear]);

  const fetchFinancialSummary = useCallback(async () => {
    // Só busca se houver mês e ano selecionados
    if (!selectedMonth || !selectedYear) {
      setFinancialSummary({
        totalIncome: 0, 
        totalExpenses: 0, 
        balance: 0
      });
      return;
    }
  
    try {
      setError(null);
      setFetchAttempted(true);
      setIsRetrying(true);
      
      // Calculate the financial summary
      const summary = await calculateFinancialSummary();
      setFinancialSummary(summary);
      
      setIsRetrying(false);
    } catch (error) {
      console.error("Error fetching financial summary data:", error);
      
      // Set appropriate error message
      if (error instanceof Error) {
        if (error.message.includes("tempo limite") || error.message.includes("timeout")) {
          setError("Erro de tempo limite ao carregar resumo financeiro.");
        } else {
          setError(error.message);
        }
      } else {
        setError("Erro ao carregar resumo financeiro");
      }
      
      setIsRetrying(false);
    }
  }, [selectedMonth, selectedYear, calculateFinancialSummary]);

  useEffect(() => {
    // Garantir que temos valores válidos para fetchAttempted quando alterarmos mês/ano
    if (selectedMonth && selectedYear) {
      setFetchAttempted(false);
    }
    
    // Só faz o fetch se não tivermos tentado ainda ou se alterarmos mês/ano
    if ((!fetchAttempted && selectedMonth && selectedYear) || 
        (selectedMonth && selectedYear && fetchAttempted)) {
      fetchFinancialSummary();
    }
  }, [fetchFinancialSummary, fetchAttempted, selectedMonth, selectedYear]);

  return { 
    financialSummary,
    error,
    retry: fetchFinancialSummary,
    isRetrying
  };
};
