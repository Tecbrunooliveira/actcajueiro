
import { ExpenseCategory, Expense } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const expenseService = {
  // Category methods
  getAllCategories: async (): Promise<ExpenseCategory[]> => {
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*');
    
    if (error) {
      console.error('Error fetching expense categories:', error);
      return [];
    }
    
    return data?.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || undefined,
      color: category.color || undefined,
    })) || [];
  },

  getCategoryById: async (id: string): Promise<ExpenseCategory | null> => {
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching expense category:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      color: data.color || undefined,
    };
  },

  createCategory: async (category: Omit<ExpenseCategory, "id">): Promise<ExpenseCategory | null> => {
    const { data, error } = await supabase
      .from('expense_categories')
      .insert({
        name: category.name,
        description: category.description,
        color: category.color,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating expense category:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      color: data.color || undefined,
    };
  },

  updateCategory: async (category: ExpenseCategory): Promise<ExpenseCategory | null> => {
    const { data, error } = await supabase
      .from('expense_categories')
      .update({
        name: category.name,
        description: category.description,
        color: category.color,
      })
      .eq('id', category.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating expense category:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      color: data.color || undefined,
    };
  },

  deleteCategory: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('expense_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting expense category:', error);
      throw error;
    }
  },

  // Expense methods
  getAllExpenses: async (): Promise<Expense[]> => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*');
    
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
    })) || [];
  },
};
