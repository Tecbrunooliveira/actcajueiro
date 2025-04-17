
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Member } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "@/schemas/paymentSchema";
import { MercadoPagoButton } from "./MercadoPagoButton";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";

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
        <FormField
          control={form.control}
          name="memberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sócio</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sócio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Valor do pagamento"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Mês</FormLabel>
                <FormControl>
                  <Input
                    type="month"
                    placeholder="YYYY-MM"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ano"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <FormField
          control={form.control}
          name="isPaid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Pago?</FormLabel>
                <FormDescription>
                  Marque se o pagamento já foi efetuado.
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {watchIsPaid && (
          <>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Pagamento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Pix">Pix</SelectItem>
                      <SelectItem value="Transferência">
                        Transferência
                      </SelectItem>
                      <SelectItem value="Cartão de Crédito">
                        Cartão de Crédito
                      </SelectItem>
                      <SelectItem value="Cartão de Débito">
                        Cartão de Débito
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

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
