
import { ExpenseCategory } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const expenseCategoryService = {
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
};
