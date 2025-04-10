
import { Member, Payment, MemberStatus, MonthlyRecord } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Sample data
const sampleMembers: Member[] = [
  {
    id: "1",
    name: "João Silva",
    status: "frequentante",
    email: "joao@example.com",
    phone: "(11) 98765-4321",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    status: "afastado",
    email: "maria@example.com",
    phone: "(11) 91234-5678",
    joinDate: "2022-06-10",
    notes: "Afastada por motivos de saúde",
  },
  {
    id: "3",
    name: "Carlos Santos",
    status: "advertido",
    email: "carlos@example.com",
    phone: "(11) 99876-5432",
    joinDate: "2022-03-20",
    notes: "Advertido por atraso em 3 pagamentos consecutivos",
  },
];

const samplePayments: Payment[] = [
  {
    id: "1",
    memberId: "1",
    amount: 100,
    date: "2024-01-10",
    month: "2024-01",
    year: 2024,
    isPaid: true,
    paymentMethod: "Pix",
  },
  {
    id: "2",
    memberId: "1",
    amount: 100,
    date: "2024-02-12",
    month: "2024-02",
    year: 2024,
    isPaid: true,
    paymentMethod: "Transferência",
  },
  {
    id: "3",
    memberId: "1",
    amount: 100,
    date: "2024-03-15",
    month: "2024-03",
    year: 2024,
    isPaid: true,
    paymentMethod: "Dinheiro",
  },
  {
    id: "4",
    memberId: "2",
    amount: 100,
    date: "2024-01-05",
    month: "2024-01",
    year: 2024,
    isPaid: true,
    paymentMethod: "Pix",
  },
  {
    id: "5",
    memberId: "2",
    amount: 100,
    date: "",
    month: "2024-02",
    year: 2024,
    isPaid: false,
  },
  {
    id: "6",
    memberId: "3",
    amount: 100,
    date: "2024-01-20",
    month: "2024-01",
    year: 2024,
    isPaid: true,
    paymentMethod: "Dinheiro",
  },
  {
    id: "7",
    memberId: "3",
    amount: 100,
    date: "",
    month: "2024-02",
    year: 2024,
    isPaid: false,
  },
  {
    id: "8",
    memberId: "3",
    amount: 100,
    date: "",
    month: "2024-03",
    year: 2024,
    isPaid: false,
  },
];

// Initialize localStorage with sample data if it doesn't exist
const initializeData = () => {
  if (!localStorage.getItem("members")) {
    localStorage.setItem("members", JSON.stringify(sampleMembers));
  }
  if (!localStorage.getItem("payments")) {
    localStorage.setItem("payments", JSON.stringify(samplePayments));
  }
};

// Member Service
export const memberService = {
  getAllMembers: (): Member[] => {
    initializeData();
    const members = localStorage.getItem("members");
    return members ? JSON.parse(members) : [];
  },

  getMemberById: (id: string): Member | undefined => {
    const members = memberService.getAllMembers();
    return members.find((member) => member.id === id);
  },

  createMember: (member: Omit<Member, "id">): Member => {
    const newMember = { ...member, id: uuidv4() };
    const members = memberService.getAllMembers();
    const updatedMembers = [...members, newMember];
    localStorage.setItem("members", JSON.stringify(updatedMembers));
    return newMember;
  },

  updateMember: (member: Member): Member => {
    const members = memberService.getAllMembers();
    const updatedMembers = members.map((m) =>
      m.id === member.id ? member : m
    );
    localStorage.setItem("members", JSON.stringify(updatedMembers));
    return member;
  },

  deleteMember: (id: string): void => {
    const members = memberService.getAllMembers();
    const updatedMembers = members.filter((member) => member.id !== id);
    localStorage.setItem("members", JSON.stringify(updatedMembers));
  },

  getMembersByStatus: (status: MemberStatus): Member[] => {
    const members = memberService.getAllMembers();
    return members.filter((member) => member.status === status);
  },
};

// Payment Service
export const paymentService = {
  getAllPayments: (): Payment[] => {
    initializeData();
    const payments = localStorage.getItem("payments");
    return payments ? JSON.parse(payments) : [];
  },

  getPaymentById: (id: string): Payment | undefined => {
    const payments = paymentService.getAllPayments();
    return payments.find((payment) => payment.id === id);
  },

  getPaymentsByMember: (memberId: string): Payment[] => {
    const payments = paymentService.getAllPayments();
    return payments.filter((payment) => payment.memberId === memberId);
  },

  getPaymentsByMonth: (month: string, year: number): Payment[] => {
    const payments = paymentService.getAllPayments();
    return payments.filter(
      (payment) => payment.month === month && payment.year === year
    );
  },

  createPayment: (payment: Omit<Payment, "id">): Payment => {
    const newPayment = { ...payment, id: uuidv4() };
    const payments = paymentService.getAllPayments();
    const updatedPayments = [...payments, newPayment];
    localStorage.setItem("payments", JSON.stringify(updatedPayments));
    return newPayment;
  },

  updatePayment: (payment: Payment): Payment => {
    const payments = paymentService.getAllPayments();
    const updatedPayments = payments.map((p) =>
      p.id === payment.id ? payment : p
    );
    localStorage.setItem("payments", JSON.stringify(updatedPayments));
    return payment;
  },

  deletePayment: (id: string): void => {
    const payments = paymentService.getAllPayments();
    const updatedPayments = payments.filter((payment) => payment.id !== id);
    localStorage.setItem("payments", JSON.stringify(updatedPayments));
  },

  getPaidPayments: (): Payment[] => {
    const payments = paymentService.getAllPayments();
    return payments.filter((payment) => payment.isPaid);
  },

  getUnpaidPayments: (): Payment[] => {
    const payments = paymentService.getAllPayments();
    return payments.filter((payment) => !payment.isPaid);
  },

  getMemberPaymentStatus: (
    memberId: string
  ): { upToDate: boolean; unpaidMonths: string[] } => {
    const payments = paymentService.getPaymentsByMember(memberId);
    const unpaidPayments = payments.filter((payment) => !payment.isPaid);
    const unpaidMonths = unpaidPayments.map((payment) => payment.month);
    return {
      upToDate: unpaidPayments.length === 0,
      unpaidMonths,
    };
  },

  getMonthlyRecord: (month: string, year: number): MonthlyRecord => {
    const payments = paymentService.getPaymentsByMonth(month, year);
    const totalMembers = memberService.getAllMembers().length;
    const paidMembers = new Set(
      payments.filter((p) => p.isPaid).map((p) => p.memberId)
    ).size;
    const unpaidMembers = totalMembers - paidMembers;
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const collectedAmount = payments
      .filter((p) => p.isPaid)
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      month,
      year,
      totalMembers,
      paidMembers,
      unpaidMembers,
      totalAmount,
      collectedAmount,
    };
  },
};

// Utility functions
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatMonthYear = (monthStr: string): string => {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
};

export const getCurrentMonthYear = (): { month: string; year: number } => {
  const date = new Date();
  const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
  const year = date.getFullYear();
  return { month, year };
};

export const getStatusLabel = (status: MemberStatus): string => {
  const statusMap: Record<MemberStatus, string> = {
    frequentante: "Frequentante",
    afastado: "Afastado",
    advertido: "Advertido",
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: MemberStatus): string => {
  const statusMap: Record<MemberStatus, string> = {
    frequentante: "bg-green-500",
    afastado: "bg-amber-500",
    advertido: "bg-red-500",
  };
  return statusMap[status] || "bg-gray-500";
};
