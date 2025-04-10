
import { useState, useEffect } from "react";
import { Member, Expense, ExpenseCategory } from "@/types";
import { memberService, expenseService, paymentService } from "@/services";
import { getStatusLabel } from "@/services/formatters";

export const useReport360Data = (selectedMonth: string, selectedYear: string) => {
  const [loading, setLoading] = useState(true);
  const [memberStatusData, setMemberStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [paymentStatusData, setPaymentStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [expensesData, setExpensesData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [financialSummary, setFinancialSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data
        const members = await memberService.getAllMembers();
        const expenses = await expenseService.getAllExpenses();
        const categories = await expenseService.getAllCategories();
        const monthlyRecord = await paymentService.getMonthlyRecord(
          selectedMonth,
          parseInt(selectedYear)
        );
        
        // Process members by status
        processMemberStatusData(members);
        
        // Process payment status
        processPaymentStatusData(monthlyRecord);
        
        // Process expenses by category
        await processExpensesData(expenses, categories, selectedMonth, selectedYear);
        
        // Calculate financial summary
        calculateFinancialSummary(monthlyRecord, expenses, selectedMonth, selectedYear);
        
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const processMemberStatusData = (members: Member[]) => {
    const statusGroups: Record<string, number> = {};
    
    members.forEach(member => {
      const status = getStatusLabel(member.status);
      statusGroups[status] = (statusGroups[status] || 0) + 1;
    });
    
    const statusColors: Record<string, string> = {
      'Frequentante': '#10b981',
      'Afastado': '#f59e0b',
      'Advertido': '#ef4444'
    };
    
    const data = Object.entries(statusGroups).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name] || '#64748b'
    }));
    
    setMemberStatusData(data);
  };

  const processPaymentStatusData = (monthlyRecord: { paidMembers: number; unpaidMembers: number }) => {
    const data = [
      { name: 'Em Dia', value: monthlyRecord.paidMembers, color: '#10b981' },
      { name: 'Inadimplentes', value: monthlyRecord.unpaidMembers, color: '#ef4444' }
    ];
    
    setPaymentStatusData(data);
  };

  const processExpensesData = async (
    expenses: Expense[], 
    categories: ExpenseCategory[],
    selectedMonth: string,
    selectedYear: string
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

  const calculateFinancialSummary = (
    monthlyRecord: { collectedAmount: number },
    expenses: Expense[],
    selectedMonth: string,
    selectedYear: string
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

  return {
    loading,
    memberStatusData,
    paymentStatusData,
    expensesData,
    financialSummary
  };
};
