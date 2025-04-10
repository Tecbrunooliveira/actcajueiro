
import React from "react";
import { Expense, ExpenseCategory } from "@/types";
import { Form } from "@/components/ui/form";
import { useExpenseForm } from "@/hooks/useExpenseForm";
import { ExpenseFormHeader } from "./ExpenseFormHeader";
import { CategorySelector } from "./CategorySelector";
import { AmountDateFields } from "./AmountDateFields";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { NotesField } from "./NotesField";
import { FormActions } from "./FormActions";

type ExpenseFormProps = {
  onSubmit: (data: Omit<Expense, "id">) => Promise<void>;
  initialData?: Expense;
  onCancel: () => void;
  categories: ExpenseCategory[];
};

export function ExpenseForm({ onSubmit, initialData, onCancel, categories }: ExpenseFormProps) {
  const { form, handleSubmit, isEditing } = useExpenseForm({
    onSubmit,
    initialData,
    onCancel,
    categories
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ExpenseFormHeader isEditing={isEditing} onCancel={onCancel} />
        
        <CategorySelector form={form} categories={categories} />
        
        <AmountDateFields form={form} />
        
        <PaymentMethodSelector form={form} />
        
        <NotesField form={form} />
        
        <FormActions isEditing={isEditing} onCancel={onCancel} />
      </form>
    </Form>
  );
}
