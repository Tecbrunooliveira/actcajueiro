import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  memberService,
  paymentService,
  getCurrentMonthYear,
  formatMonthYear,
} from "@/services/dataService";
import { Member } from "@/types";
import { useToast } from "@/hooks/use-toast";

const paymentSchema = z.object({
  memberId: z.string().min(1, "Sócio é obrigatório"),
  amount: z.coerce.number().min(1, "Valor é obrigatório"),
  month: z.string().min(1, "Mês é obrigatório"),
  year: z.coerce.number().min(2020, "Ano inválido"),
  isPaid: z.boolean().default(false),
  date: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const PaymentForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;
  const [members, setMembers] = useState<Member[]>([]);
  const { month, year } = getCurrentMonthYear();

  const payment = isEditMode ? paymentService.getPaymentById(id) : null;

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      memberId: payment?.memberId || "",
      amount: payment?.amount || 100,
      month: payment?.month || month,
      year: payment?.year || year,
      isPaid: payment?.isPaid || false,
      date: payment?.date || "",
      paymentMethod: payment?.paymentMethod || "",
      notes: payment?.notes || "",
    },
  });

  useEffect(() => {
    setMembers(memberService.getAllMembers());
  }, []);

  const watchIsPaid = form.watch("isPaid");

  const onSubmit = (data: PaymentFormValues) => {
    // Make sure date is set if isPaid is true
    if (data.isPaid && !data.date) {
      data.date = new Date().toISOString().split("T")[0];
    }

    // Clear payment method if not paid
    if (!data.isPaid) {
      data.paymentMethod = "";
      data.date = "";
    }

    if (isEditMode && payment) {
      paymentService.updatePayment({ ...payment, ...data });
      toast({
        title: "Pagamento atualizado",
        description: "As informações do pagamento foram atualizadas com sucesso",
      });
    } else {
      // Ensure all required fields are present
      const newPayment = {
        memberId: data.memberId,
        amount: data.amount,
        month: data.month,
        year: data.year,
        isPaid: data.isPaid,
        date: data.date || "",
        paymentMethod: data.paymentMethod || undefined,
        notes: data.notes || undefined,
      };
      
      paymentService.createPayment(newPayment);
      toast({
        title: "Pagamento criado",
        description: "O novo pagamento foi criado com sucesso",
      });
    }
    navigate("/payments");
  };

  return (
    <MobileLayout
      title={isEditMode ? "Editar Pagamento" : "Novo Pagamento"}
    >
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
                      defaultValue={String(year)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-club-500 hover:bg-club-600">
              {isEditMode ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </Form>
    </MobileLayout>
  );
};

export default PaymentForm;
