import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Expense, ExpenseCategory } from "@/types";

const expenseSchema = z.object({
  description: z.string().optional(),
  amount: z.coerce.number().positive({ message: "O valor deve ser maior que zero" }),
  date: z.string().min(1, { message: "Selecione uma data" }),
  categoryId: z.string().min(1, { message: "Selecione uma categoria" }),
  paymentMethod: z.string().min(1, { message: "Selecione um método de pagamento" }),
  notes: z.string().optional(),
  type: z.enum(["despesa", "receita"]).default("despesa"),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

type UseExpenseFormProps = {
  onSubmit: (data: Omit<Expense, "id">) => Promise<void>;
  initialData?: Expense;
  onCancel: () => void;
  categories: ExpenseCategory[];
};

export function useExpenseForm({ onSubmit, initialData, onCancel, categories }: UseExpenseFormProps) {
  const { toast } = useToast();
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: initialData?.description || "",
      amount: initialData?.amount || 0,
      date: initialData?.date || new Date().toISOString().split('T')[0],
      categoryId: initialData?.categoryId || "",
      paymentMethod: initialData?.paymentMethod || "pix",
      notes: initialData?.notes || "",
      type: initialData?.type || "despesa",
    },
  });

  const watchCategoryId = form.watch("categoryId");
  
  useEffect(() => {
    if (watchCategoryId) {
      const selectedCategory = categories.find(cat => cat.id === watchCategoryId);
      if (selectedCategory) {
        form.setValue("description", selectedCategory.name);
      }
    }
  }, [watchCategoryId, categories, form]);

  const handleSubmit = async (data: ExpenseFormValues) => {
    try {
      await onSubmit({
        description: data.description || categories.find(cat => cat.id === data.categoryId)?.name || "Despesa sem descrição",
        amount: data.amount,
        date: data.date,
        categoryId: data.categoryId,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        type: data.type,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a despesa.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    handleSubmit,
    isEditing: !!initialData,
    onCancel
  };
}
