
import { useState, useEffect, useCallback } from "react";
import { Expense } from "@/types";
import { paymentService, expenseService } from "@/services";

export const useFinancialSummary = (selectedMonth: string, selectedYear: string) => {
  const [financialSummary, setFinancialSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const calculateFinancialSummary = useCallback((
    monthlyRecord: { collectedAmount: number } | null,
    expenses: Expense[] | null
  ) => {
    // Provide default values if data is missing
    const totalIncome = monthlyRecord?.collectedAmount || 0;
    
    // Calculate total expenses with fallback
    let totalExpenses = 0;
    
    if (expenses && expenses.length > 0) {
      // Garante que temos valores válidos
      const year = parseInt(selectedYear || "0");
      const month = selectedMonth ? parseInt(selectedMonth.split('-')[1]) : 0;
      
      if (year && month) {
        totalExpenses = expenses
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
    
    setFinancialSummary({
      totalIncome,
      totalExpenses,
      balance
    });
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
      
      // Parse year para verificar se é válido
      const yearNumber = parseInt(selectedYear);
      if (isNaN(yearNumber)) {
        throw new Error("Ano inválido selecionado");
      }
      
      // Add timeout for better error handling - increased to 8 seconds
      const monthlyRecordPromise = paymentService.getMonthlyRecord(
        selectedMonth,
        yearNumber
      );
      const expensesPromise = expenseService.getAllExpenses();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar resumo financeiro.")), 8000)
      );
      
      // Use Promise.race with Promise.all to add a timeout
      try {
        const [monthlyRecord, expenses] = await Promise.race([
          Promise.all([monthlyRecordPromise, expensesPromise]),
          timeoutPromise.then(() => { throw new Error("Tempo limite excedido"); })
        ]);
        
        // Calculate financial summary
        calculateFinancialSummary(monthlyRecord, expenses);
      } catch (error) {
        // If the combined request fails, try to get at least partial data
        console.warn("Falling back to partial data loading for financial summary");
        
        let monthlyRecord = null;
        let expenses = null;
        
        try {
          monthlyRecord = await Promise.race([
            monthlyRecordPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
          ]);
        } catch (e) {
          console.error("Failed to fetch monthly record:", e);
        }
        
        try {
          expenses = await Promise.race([
            expensesPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
          ]);
        } catch (e) {
          console.error("Failed to fetch expenses:", e);
        }
        
        // Use whatever data we got
        calculateFinancialSummary(monthlyRecord, expenses);
        
        // Still throw the original error for proper error handling
        throw error;
      }
      
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
