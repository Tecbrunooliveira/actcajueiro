
import { useState, useEffect } from "react";
import { Expense } from "@/types";
import { paymentService, expenseService } from "@/services";

export const useFinancialSummary = (selectedMonth: string, selectedYear: string) => {
  const [financialSummary, setFinancialSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });

  useEffect(() => {
    const fetchFinancialSummary = async () => {
      try {
        // Fetch data
        const monthlyRecord = await paymentService.getMonthlyRecord(
          selectedMonth,
          parseInt(selectedYear)
        );
        const expenses = await expenseService.getAllExpenses();
        
        // Calculate financial summary
        calculateFinancialSummary(monthlyRecord, expenses);
      } catch (error) {
        console.error("Error fetching financial summary data:", error);
      }
    };

    fetchFinancialSummary();
  }, [selectedMonth, selectedYear]);

  const calculateFinancialSummary = (
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
  };

  return { financialSummary };
};
