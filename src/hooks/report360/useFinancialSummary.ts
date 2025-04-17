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

  const calculateFinancialSummary = useCallback((
    monthlyRecord: { collectedAmount: number },
    expenses: Expense[]
  ) => {
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth.split('-')[1]);
    
    // Calculate total income from monthly record
    const totalIncome = monthlyRecord.collectedAmount;
    
    // Calculate total expenses for the month
    const totalExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === year && expenseDate.getMonth() === month - 1;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate balance
    const balance = totalIncome - totalExpenses;
    
    setFinancialSummary({
      totalIncome,
      totalExpenses,
      balance
    });
  }, [selectedMonth, selectedYear]);

  const fetchFinancialSummary = useCallback(async () => {
    try {
      setError(null);
      
      // Add timeout for better error handling
      const monthlyRecordPromise = paymentService.getMonthlyRecord(
        selectedMonth,
        parseInt(selectedYear)
      );
      const expensesPromise = expenseService.getAllExpenses();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar resumo financeiro.")), 5000)
      );
      
      // Use Promise.race with Promise.all to add a timeout
      const [monthlyRecord, expenses] = await Promise.race([
        Promise.all([monthlyRecordPromise, expensesPromise]),
        timeoutPromise.then(() => { throw new Error("Tempo limite excedido"); })
      ]);
      
      // Calculate financial summary
      calculateFinancialSummary(monthlyRecord, expenses);
    } catch (error) {
      console.error("Error fetching financial summary data:", error);
      setError(error instanceof Error ? error.message : "Erro ao carregar resumo financeiro");
      
      // Keep default values to avoid undefined errors
      setFinancialSummary({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0
      });
    }
  }, [selectedMonth, selectedYear, calculateFinancialSummary]);

  useEffect(() => {
    fetchFinancialSummary();
  }, [fetchFinancialSummary]);

  return { 
    financialSummary,
    error,
    retry: fetchFinancialSummary
  };
};
