
import { z } from "zod";
import { getCurrentMonthYear } from "@/services/formatters";

export const paymentSchema = z.object({
  memberId: z.string().min(1, "Sócio é obrigatório"),
  amount: z.coerce.number().min(1, "Valor é obrigatório"),
  month: z.string().min(1, "Mês é obrigatório"),
  year: z.coerce.number().min(2020, "Ano inválido"),
  isPaid: z.boolean().default(false),
  date: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export const defaultPaymentValues = (): PaymentFormValues => {
  const { month, year } = getCurrentMonthYear();
  
  return {
    memberId: "",
    amount: 30,
    month: month,
    year: year,
    isPaid: false,
    date: "",
    paymentMethod: "",
    notes: "",
  };
};
