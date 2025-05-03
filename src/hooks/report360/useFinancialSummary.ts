import { useState, useEffect, useCallback } from "react";
import { Expense } from "@/types";
import { paymentService, expenseService } from "@/services";
import { paymentQueryService } from "@/services/payment/paymentQueryService";

export const useFinancialSummary = (selectedMonth: string, selectedYear: string) => {
  const [financialSummary, setFinancialSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    totalPaymentIncome: 0,
    totalCategoryIncome: 0,
    categoryIncomes: [] as { name: string; value: number }[],
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
        balance: 0,
        totalPaymentIncome: 0,
        totalCategoryIncome: 0,
        categoryIncomes: [],
      };
    }
    
    try {
      console.log(`Calculating financial summary for ${selectedMonth}-${selectedYear}`);
      
      // Get the payment data directly from paymentQueryService
      const yearNumber = parseInt(selectedYear);
      const payments = await paymentQueryService.getPaymentsByMonth(selectedMonth, yearNumber);
      
      // Sum up paid payments to calculate total income
      let totalIncome = payments
        .filter(payment => payment.isPaid)
        .reduce((sum, payment) => sum + payment.amount, 0);
      let totalPaymentIncome = totalIncome;
      
      console.log(`Calculated totalIncome: ${totalIncome} from ${payments.length} payments`);
      
      // Get expenses for the selected month/year
      const allExpenses = await expenseService.getAllExpenses();
      
      // Filter expenses by month and year
      let totalExpenses = 0;
      let totalExtraIncome = 0;
      let categoryIncomes: { name: string; value: number }[] = [];
      if (allExpenses && allExpenses.length > 0) {
        const year = parseInt(selectedYear);
        const month = selectedMonth ? parseInt(selectedMonth.split('-')[1]) : 0;
        if (year && month) {
          // Buscar categorias
          const categories = await expenseService.getAllCategories();
          // Agrupar receitas por categoria
          const receitas = allExpenses.filter(expense => {
            try {
              const expenseDate = new Date(expense.date);
              return expense.type === 'receita' && expenseDate.getFullYear() === year && expenseDate.getMonth() === month - 1;
            } catch (e) {
              return false;
            }
          });
          const receitasPorCategoria: Record<string, number> = {};
          receitas.forEach(expense => {
            if (!receitasPorCategoria[expense.categoryId]) receitasPorCategoria[expense.categoryId] = 0;
            receitasPorCategoria[expense.categoryId] += expense.amount || 0;
          });
          categoryIncomes = Object.entries(receitasPorCategoria).map(([categoryId, value]) => {
            const cat = categories.find(c => c.id === categoryId);
            return { name: cat?.name || 'Sem categoria', value };
          });
          totalExtraIncome = receitas.reduce((sum, expense) => sum + (expense.amount || 0), 0);

          totalExpenses = allExpenses
            .filter(expense => {
              try {
                const expenseDate = new Date(expense.date);
                return expense.type !== 'receita' && expenseDate.getFullYear() === year && expenseDate.getMonth() === month - 1;
              } catch (e) {
                return false; // Skip invalid dates
              }
            })
            .reduce((sum, expense) => sum + (expense.amount || 0), 0);
        }
      }
      
      // Incluir receitas extras no totalIncome
      totalIncome += totalExtraIncome;
      // Calculate balance
      const balance = totalIncome - totalExpenses;
      
      console.log(`Financial summary calculated: Income: ${totalIncome}, Expenses: ${totalExpenses}, Balance: ${balance}`);
      
      return {
        totalIncome,
        totalExpenses,
        balance,
        totalPaymentIncome,
        totalCategoryIncome: totalExtraIncome,
        categoryIncomes,
      };
    } catch (error) {
      console.error("Error in calculateFinancialSummary:", error);
      // Return default values on error
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        totalPaymentIncome: 0,
        totalCategoryIncome: 0,
        categoryIncomes: [],
      };
    }
  }, [selectedMonth, selectedYear]);

  const fetchFinancialSummary = useCallback(async () => {
    // Só busca se houver mês e ano selecionados
    if (!selectedMonth || !selectedYear) {
      setFinancialSummary({
        totalIncome: 0, 
        totalExpenses: 0, 
        balance: 0,
        totalPaymentIncome: 0,
        totalCategoryIncome: 0,
        categoryIncomes: [],
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
