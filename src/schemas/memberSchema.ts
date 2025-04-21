
import { z } from "zod";

export const warningSchema = z.object({
  text: z.string().min(1, "A advertência não pode estar vazia"),
  date: z.string(),
});

export const memberSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  status: z.enum(["frequentante", "afastado"]),
  email: z.string().email("Email inválido").or(z.string().length(0)).optional(),
  phone: z.string().optional(),
  joinDate: z.string(),
  notes: z.string().optional(),
  photo: z.string().optional(),
  warnings: z.array(warningSchema).optional(),
  user_id: z.string().optional(), // Added user_id field
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
  warnings: [],
  user_id: "", // Added default value for user_id
};
