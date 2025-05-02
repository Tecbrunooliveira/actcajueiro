
import React from "react";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "@/schemas/paymentSchema";
import { Member } from "@/types";
import { PaymentBasicFields } from "./PaymentBasicFields";
import { PaymentStatusFields } from "./PaymentStatusFields";
import { PaymentFormActions } from "./PaymentFormActions";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PaymentFormComponentProps {
  form: UseFormReturn<PaymentFormValues>;
  members: Member[];
  onSubmit: (data: PaymentFormValues) => Promise<void>;
  isEditMode: boolean;
  submitLoading: boolean;
  watchIsPaid: boolean;
}

export function PaymentFormComponent({
  form,
  members,
  onSubmit,
  isEditMode,
  submitLoading,
  watchIsPaid,
}: PaymentFormComponentProps) {
  const navigate = useNavigate();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PaymentBasicFields form={form} members={members} />
        <PaymentStatusFields form={form} watchIsPaid={watchIsPaid} />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informações adicionais..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/payments")}
            disabled={submitLoading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-club-500 hover:bg-club-600"
            disabled={submitLoading}
          >
            {submitLoading ? "Salvando..." : isEditMode ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
