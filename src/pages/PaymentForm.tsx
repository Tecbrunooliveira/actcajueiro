
import React, { useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
} from "@/components/ui/form";
import {
  memberService,
  paymentService,
  getCurrentMonthYear,
} from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

const paymentSchema = z.object({
  memberId: z.string().min(1, "Sócio é obrigatório"),
  amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
  month: z.string().min(1, "Mês é obrigatório"),
  isPaid: z.boolean(),
  paymentMethod: z.string().optional(),
  date: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const PaymentForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedMemberId = queryParams.get("memberId");
  
  const isEditMode = !!id;
  const payment = isEditMode ? paymentService.getPaymentById(id) : null;
  
  const members = memberService.getAllMembers();
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear();

  // Generate month options (12 months back to 12 months ahead)
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Start 12 months ago
    for (let i = -12; i <= 12; i++) {
      let month = currentMonth + i;
      let year = currentYear;
      
      // Adjust year for month overflow/underflow
      if (month < 0) {
        month += 12;
        year -= 1;
      } else if (month > 11) {
        month -= 12;
        year += 1;
      }
      
      const monthStr = String(month + 1).padStart(2, "0");
      const value = `${year}-${monthStr}`;
      
      options.push({
        value,
        label: new Date(year, month).toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
      });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      memberId: payment?.memberId || preselectedMemberId || "",
      amount: payment?.amount || 100,
      month: payment?.month || currentMonth,
      isPaid: payment?.isPaid || false,
      paymentMethod: payment?.paymentMethod || "",
      date: payment?.date || "",
      notes: payment?.notes || "",
    },
  });

  // Watch for isPaid changes to set date
  const isPaid = form.watch("isPaid");
  
  useEffect(() => {
    if (isPaid && !form.getValues("date")) {
      form.setValue("date", new Date().toISOString().split("T")[0]);
    }
  }, [isPaid, form]);

  const onSubmit = (data: PaymentFormValues) => {
    const year = parseInt(data.month.split("-")[0]);
    
    // Prepare data - set date to empty if not paid
    if (!data.isPaid) {
      data.date = "";
      data.paymentMethod = "";
    }
    
    if (isEditMode && payment) {
      paymentService.updatePayment({
        ...payment,
        ...data,
        year,
      });
      toast({
        title: "Pagamento atualizado",
        description: "O pagamento foi atualizado com sucesso",
      });
    } else {
      paymentService.createPayment({
        ...data,
        year,
      });
      toast({
        title: "Pagamento registrado",
        description: "O novo pagamento foi registrado com sucesso",
      });
    }
    navigate(preselectedMemberId ? `/members/${preselectedMemberId}` : "/payments");
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
                  disabled={!!preselectedMemberId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um sócio" />
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
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mês de Referência</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Pagamento Realizado</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {isPaid && (
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
                        <SelectItem value="Cartão">Cartão</SelectItem>
                        <SelectItem value="Transferência">
                          Transferência
                        </SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
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
              onClick={() => 
                navigate(preselectedMemberId 
                  ? `/members/${preselectedMemberId}` 
                  : "/payments"
                )
              }
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-club-500 hover:bg-club-600">
              {isEditMode ? "Atualizar" : "Registrar"}
            </Button>
          </div>
        </form>
      </Form>
    </MobileLayout>
  );
};

export default PaymentForm;
