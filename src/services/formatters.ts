
import { MemberStatus } from "@/types";

// Utility formatters
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatMonthYear = (monthStr: string, showYearOption: boolean = true): string => {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  
  if (showYearOption) {
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  } else {
    return date.toLocaleDateString("pt-BR", { month: "long" });
  }
};

// Add the missing formatDateBR function
export const formatDateBR = (dateStr: string): string => {
  const date = new Date(dateStr);
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
