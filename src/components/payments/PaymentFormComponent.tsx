import React from "react";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Member } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "@/schemas/paymentSchema";
import { MercadoPagoButton } from "./MercadoPagoButton";
import { PaymentBasicFields } from "./PaymentBasicFields";
import { PaymentStatusFields } from "./PaymentStatusFields";
import { PaymentFormActions } from "./PaymentFormActions";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  const watchMemberId = form.watch("memberId");
  const watchAmount = form.watch("amount");
  const watchMonth = form.watch("month");
  const watchYear = form.watch("year");

  const canGeneratePaymentLink = watchMemberId && watchAmount && watchAmount > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PaymentBasicFields form={form} members={members} />

        {canGeneratePaymentLink && (
          <Card className="border-[#009ee3] bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Link de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">
                Gere um link de pagamento para enviar ao sócio. O pagamento será registrado automaticamente quando confirmado.
              </p>
              <MercadoPagoButton 
                payment={{
                  memberId: watchMemberId,
                  amount: watchAmount,
                  month: watchMonth,
                  year: watchYear
                }}
                showIcon
              />
            </CardContent>
          </Card>
        )}

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
