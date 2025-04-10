
import { useState, useEffect } from "react";
import { Expense, ExpenseCategory } from "@/types";
import { expenseService } from "@/services";

export const useExpensesData = (selectedMonth: string, selectedYear: string) => {
  const [expensesData, setExpensesData] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    const fetchExpensesData = async () => {
      try {
        // Fetch all required data
        const expenses = await expenseService.getAllExpenses();
        const categories = await expenseService.getAllCategories();
        
        // Process expenses by category
        await processExpensesData(expenses, categories);
      } catch (error) {
        console.error("Error fetching expenses data:", error);
      }
    };

    fetchExpensesData();
  }, [selectedMonth, selectedYear]);

  const processExpensesData = async (
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
  };

  return { expensesData };
};
