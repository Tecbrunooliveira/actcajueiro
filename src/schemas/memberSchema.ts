
import { z } from "zod";
import { MemberStatus } from "@/types";

export const memberSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  status: z.enum(["frequentante", "afastado", "advertido", "suspenso", "licenciado"] as const),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  joinDate: z.string().min(1, "Data de entrada é obrigatória"),
  notes: z.string().optional(),
  photo: z.string().optional(),
});

export type MemberFormValues = z.infer<typeof memberSchema>;

export const defaultMemberValues: MemberFormValues = {
  name: "",
  status: "frequentante",
  email: "",
  phone: "",
  joinDate: new Date().toISOString().split("T")[0],
  notes: "",
  photo: "",
};
