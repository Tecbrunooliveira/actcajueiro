
import { v4 as uuidv4 } from 'uuid';
import { Expense, ExpenseCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const expenseService = {
  // Category management
  getAllCategories: async (): Promise<ExpenseCategory[]> => {
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*');
      
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
    }));
  },
  
  createCategory: async (category: Omit<ExpenseCategory, 'id'>): Promise<ExpenseCategory | null> => {
    const newCategory = {
      ...category,
      id: uuidv4(),
    };
    
    const { data, error } = await supabase
      .from('expense_categories')
      .insert([{
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description,
        color: newCategory.color,
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating category:', error);
      return null;
    }
    
    return data as ExpenseCategory;
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
      console.error('Error updating category:', error);
      return null;
    }
    
    return data as ExpenseCategory;
  },
  
  deleteCategory: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('expense_categories')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }
    
    return true;
  },
  
  // Expense management
  getAllExpenses: async (): Promise<Expense[]> => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*');
      
    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
    
    return data.map(expense => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      categoryId: expense.category_id,
      paymentMethod: expense.payment_method,
      notes: expense.notes,
    }));
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
    
    return data.map(expense => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      categoryId: expense.category_id,
      paymentMethod: expense.payment_method,
      notes: expense.notes,
    }));
  },
  
  createExpense: async (expense: Omit<Expense, 'id'>): Promise<Expense | null> => {
    const newExpense = {
      ...expense,
      id: uuidv4(),
    };
    
    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        id: newExpense.id,
        description: newExpense.description,
        amount: newExpense.amount,
        date: newExpense.date,
        category_id: newExpense.categoryId,
        payment_method: newExpense.paymentMethod,
        notes: newExpense.notes,
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating expense:', error);
      return null;
    }
    
    return {
      id: data.id,
      description: data.description,
      amount: data.amount,
      date: data.date,
      categoryId: data.category_id,
      paymentMethod: data.payment_method,
      notes: data.notes,
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
      return null;
    }
    
    return {
      id: data.id,
      description: data.description,
      amount: data.amount,
      date: data.date,
      categoryId: data.category_id,
      paymentMethod: data.payment_method,
      notes: data.notes,
    };
  },
  
  deleteExpense: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting expense:', error);
      return false;
    }
    
    return true;
  },
};
