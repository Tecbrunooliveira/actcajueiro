
// Re-export all expense-related services
export * from './expenseCategoryService';
export * from './expenseBaseService';

// Create a consolidated expenseService for backward compatibility
import { expenseCategoryService } from './expenseCategoryService';
import { expenseBaseService } from './expenseBaseService';

export const expenseService = {
  // Category methods
  ...expenseCategoryService,
  
  // Expense methods
  ...expenseBaseService,

  // Methods to ensure backward compatibility
  getAllCategories: expenseCategoryService.getAllCategories,
  getCategoryById: expenseCategoryService.getCategoryById,
  createCategory: expenseCategoryService.createCategory,
  updateCategory: expenseCategoryService.updateCategory,
  deleteCategory: expenseCategoryService.deleteCategory,
  
  getAllExpenses: expenseBaseService.getAllExpenses,
  getExpenseById: expenseBaseService.getExpenseById,
  createExpense: expenseBaseService.createExpense,
  updateExpense: expenseBaseService.updateExpense,
  deleteExpense: expenseBaseService.deleteExpense,
  getExpensesByCategory: expenseBaseService.getExpensesByCategory,
};
