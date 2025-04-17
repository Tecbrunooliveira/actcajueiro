
import { useState, useEffect, useCallback } from "react";
import { Expense, ExpenseCategory } from "@/types";
import { expenseService } from "@/services";

export const useExpensesData = (selectedMonth: string, selectedYear: string) => {
  const [expensesData, setExpensesData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const processExpensesData = useCallback(async (
    expenses: Expense[], 
    categories: ExpenseCategory[]
  ) => {
    // Get the date range for the selected month and year
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth.split('-')[1]);
    
    // Filter expenses for the selected month
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month - 1;
    });
    
    // Group expenses by category
    const expensesByCategory: Record<string, number> = {};
    const categoryMap: Record<string, ExpenseCategory> = {};
    
    // Create a map of category id to category object for easy lookup
    categories.forEach(category => {
      categoryMap[category.id] = category;
    });
    
    // Group expenses by category
    filteredExpenses.forEach(expense => {
      const categoryId = expense.categoryId;
      const categoryName = categoryMap[categoryId]?.name || 'Sem categoria';
      
      expensesByCategory[categoryName] = (expensesByCategory[categoryName] || 0) + expense.amount;
    });
    
    // Format data for chart
    const data = Object.entries(expensesByCategory).map(([name, value]) => {
      // Find the category to get its color
      const category = Object.values(categoryMap).find(cat => cat.name === name);
      
      return {
        name,
        value,
        color: category?.color || `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
    });
    
    setExpensesData(data);
  }, []);

  const fetchExpensesData = useCallback(async () => {
    try {
      setError(null);
      
      // Add timeout for better error handling
      const expensesPromise = expenseService.getAllExpenses();
      const categoriesPromise = expenseService.getAllCategories();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar dados de despesas.")), 5000)
      );
      
      // Use Promise.race with Promise.all to add a timeout
      const [expenses, categories] = await Promise.race([
        Promise.all([expensesPromise, categoriesPromise]),
        timeoutPromise.then(() => { throw new Error("Tempo limite excedido"); })
      ]);
      
      // Process expenses by category
      await processExpensesData(expenses, categories);
    } catch (error) {
      console.error("Error fetching expenses data:", error);
      setError(error instanceof Error ? error.message : "Erro ao carregar dados de despesas");
      
      // Set empty data to avoid undefined errors
      setExpensesData([]);
    }
  }, [selectedMonth, selectedYear, processExpensesData]);

  useEffect(() => {
    fetchExpensesData();
  }, [fetchExpensesData]);

  return { 
    expensesData,
    error,
    retry: fetchExpensesData
  };
};
