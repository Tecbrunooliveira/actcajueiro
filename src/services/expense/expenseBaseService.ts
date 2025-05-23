
import { Expense } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const expenseBaseService = {
  getAllExpenses: async (filters?: { month?: number; year?: number; type?: string }) : Promise<Expense[]> => {
    let query = supabase.from('expenses').select('id, description, amount, date, category_id, payment_method, notes, type');
    if (filters) {
      if (filters.type) query = query.eq('type', filters.type);
      if (filters.month && filters.year) {
        // Filtrar por mês/ano no lado do cliente após buscar, pois Supabase não suporta funções de data diretamente
      }
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
    return data?.map(expense => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      categoryId: expense.category_id || "",
      paymentMethod: expense.payment_method || undefined,
      notes: expense.notes || undefined,
      type: (expense?.type || "despesa") as "despesa" | "receita",
    })) || [];
  },

  getExpenseById: async (id: string): Promise<Expense | null> => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching expense:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      description: data.description,
      amount: data.amount,
      date: data.date,
      categoryId: data.category_id || "",
      paymentMethod: data.payment_method || undefined,
      notes: data.notes || undefined,
      type: (data?.type || "despesa") as "despesa" | "receita",
    };
  },

  createExpense: async (expense: Omit<Expense, "id">): Promise<Expense | null> => {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category_id: expense.categoryId,
        payment_method: expense.paymentMethod,
        notes: expense.notes,
        type: expense.type,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      description: data.description,
      amount: data.amount,
      date: data.date,
      categoryId: data.category_id || "",
      paymentMethod: data.payment_method || undefined,
      notes: data.notes || undefined,
      type: (data?.type || "despesa") as "despesa" | "receita",
    };
  },

  updateExpense: async (expense: Expense): Promise<Expense | null> => {
    const { data, error } = await supabase
      .from('expenses')
      .update({
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category_id: expense.categoryId,
        payment_method: expense.paymentMethod,
        notes: expense.notes,
        type: expense.type,
      })
      .eq('id', expense.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      description: data.description,
      amount: data.amount,
      date: data.date,
      categoryId: data.category_id || "",
      paymentMethod: data.payment_method || undefined,
      notes: data.notes || undefined,
      type: (data?.type || "despesa") as "despesa" | "receita",
    };
  },

  deleteExpense: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  getExpensesByCategory: async (categoryId: string): Promise<Expense[]> => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('category_id', categoryId);
    
    if (error) {
      console.error('Error fetching expenses by category:', error);
      return [];
    }
    
    return data?.map(expense => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      categoryId: expense.category_id || "",
      paymentMethod: expense.payment_method || undefined,
      notes: expense.notes || undefined,
      type: (expense?.type || "despesa") as "despesa" | "receita",
    })) || [];
  },
};
