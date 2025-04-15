
import { MemberStatus } from "@/types";

// Utility formatters
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatMonthYear = (monthStr: string, showYearOption: boolean = true): string => {
  if (!monthStr) return '';
  
  const [year, month] = monthStr.split("-");
  if (!year || !month) return '';
  
  const date = new Date(parseInt(year), parseInt(month) - 1);
  
  if (showYearOption) {
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  } else {
    return date.toLocaleDateString("pt-BR", { month: "long" });
  }
};

// Add the missing formatDateBR function
export const formatDateBR = (dateStr: string): string => {
  if (!dateStr) return '';
  
  // Se for no formato YYYY-MM (para pagamentos)
  if (dateStr.match(/^\d{4}-\d{2}$/)) {
    const [year, month] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  }
  
  // Se for uma data completa YYYY-MM-DD
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  
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
    afastado: "Afastado"
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: MemberStatus): string => {
  const statusMap: Record<MemberStatus, string> = {
    frequentante: "bg-green-500",
    afastado: "bg-amber-500"
  };
  return statusMap[status] || "bg-gray-500";
};

// Função para formatar mês/ano em formato legível para badges
export const formatMonthBadge = (monthStr: string): string => {
  if (!monthStr) return '';
  
  const [year, month] = monthStr.split("-");
  if (!year || !month) return '';
  
  return `${month}/${year}`;
};
