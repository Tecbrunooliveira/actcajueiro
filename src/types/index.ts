export type MemberStatus = 'frequentante' | 'afastado';

export interface Position {
  id: string;
  name: string;
}

export interface Member {
  id: string;
  name: string;
  status: MemberStatus;
  email?: string;
  phone?: string;
  joinDate: string;
  notes?: string;
  photo?: string;
  warnings?: Array<{ text: string; date: string }>;
  user_id?: string;
  level?: number;
  position_id?: string;
  position?: Position; // The full object including the id and name
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  month: string;
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
  type: "despesa" | "receita";
}
