
import { useState, useEffect, useCallback } from "react";
import { Expense, ExpenseCategory } from "@/types";
import { expenseService } from "@/services";

export const useExpensesData = (selectedMonth: string, selectedYear: string) => {
  const [expensesData, setExpensesData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  const processExpensesData = useCallback(async (
    expenses: Expense[] | null, 
    categories: ExpenseCategory[] | null
  ) => {
    // Early exit for empty data
    if (!expenses || expenses.length === 0 || !categories || categories.length === 0) {
      setExpensesData([
        { name: 'Sem despesas', value: 0, color: '#64748b' }
      ]);
      return;
    }
    
    try {
      // Get the date range for the selected month and year
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth.split('-')[1]);
      
      // Filter expenses for the selected month
      const filteredExpenses = expenses.filter(expense => {
        try {
          const expenseDate = new Date(expense.date);
          return expenseDate.getFullYear() === year && expenseDate.getMonth() === month - 1;
        } catch (e) {
          return false; // Skip invalid dates
        }
      });
      
      // If no expenses for the month, show empty state
      if (filteredExpenses.length === 0) {
        setExpensesData([
          { name: 'Sem despesas', value: 1, color: '#64748b' }
        ]);
        return;
      }
      
      // Group expenses by category
      const expensesByCategory: Record<string, number> = {};
      const categoryMap: Record<string, ExpenseCategory> = {};
      
      // Create a map of category id to category object for easy lookup
      categories.forEach(category => {
        if (category && category.id) {
          categoryMap[category.id] = category;
        }
      });
      
      // Group expenses by category
      filteredExpenses.forEach(expense => {
        if (!expense.categoryId) return;
        
        const categoryId = expense.categoryId;
        const categoryName = categoryMap[categoryId]?.name || 'Sem categoria';
        
        expensesByCategory[categoryName] = (expensesByCategory[categoryName] || 0) + (expense.amount || 0);
      });
      
      // If no expenses grouped, show empty state
      if (Object.keys(expensesByCategory).length === 0) {
        setExpensesData([
          { name: 'Sem despesas', value: 1, color: '#64748b' }
        ]);
        return;
      }
      
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
    } catch (e) {
      console.error("Error processing expenses data:", e);
      setExpensesData([
        { name: 'Erro', value: 1, color: '#ef4444' }
      ]);
    }
  }, [selectedMonth, selectedYear]);

  const fetchExpensesData = useCallback(async () => {
    try {
      setError(null);
      setFetchAttempted(true);
      
      // Add timeout for better error handling
      const expensesPromise = expenseService.getAllExpenses();
      const categoriesPromise = expenseService.getAllCategories();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar dados de despesas.")), 8000)
      );
      
      // Try to get both datasets with timeout
      try {
        const [expenses, categories] = await Promise.race([
          Promise.all([expensesPromise, categoriesPromise]),
          timeoutPromise.then(() => { throw new Error("Tempo limite excedido"); })
        ]);
        
        // Process expenses by category
        await processExpensesData(expenses, categories);
      } catch (error) {
        // If the combined request fails, try to get at least partial data
        console.warn("Falling back to partial data loading for expenses");
        
        let expenses = null;
        let categories = null;
        
        try {
          expenses = await Promise.race([
            expensesPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
          ]);
        } catch (e) {
          console.error("Failed to fetch expenses:", e);
        }
        
        try {
          categories = await Promise.race([
            categoriesPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
          ]);
        } catch (e) {
          console.error("Failed to fetch categories:", e);
        }
        
        // Process whatever data we got
        await processExpensesData(expenses, categories);
        
        // Still throw the original error for proper error handling
        throw error;
      }
    } catch (error) {
      console.error("Error fetching expenses data:", error);
      
      // Set more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("tempo limite") || error.message.includes("timeout")) {
          setError("Erro de tempo limite ao carregar dados de despesas.");
        } else {
          setError(error.message);
        }
      } else {
        setError("Erro ao carregar dados de despesas");
      }
    }
  }, [processExpensesData]);

  useEffect(() => {
    // Only fetch if we haven't tried yet or if month/year changes
    if (!fetchAttempted || selectedMonth || selectedYear) {
      fetchExpensesData();
    }
  }, [fetchExpensesData, fetchAttempted, selectedMonth, selectedYear]);

  return { 
    expensesData,
    error,
    retry: fetchExpensesData
  };
};
