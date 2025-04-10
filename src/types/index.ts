
export type MemberStatus = 'frequentante' | 'afastado' | 'advertido';

export interface Member {
  id: string;
  name: string;
  status: MemberStatus;
  email?: string;
  phone?: string;
  joinDate: string;
  notes?: string;
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  month: string; // Format: "YYYY-MM"
  year: number;
  isPaid: boolean;
  paymentMethod?: string;
  notes?: string;
}

export interface MonthlyRecord {
  month: string;
  year: number;
  totalMembers: number;
  paidMembers: number;
  unpaidMembers: number;
  totalAmount: number;
  collectedAmount: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  paymentMethod?: string;
  notes?: string;
}
