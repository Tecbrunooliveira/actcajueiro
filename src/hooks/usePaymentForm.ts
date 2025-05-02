import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { memberService, paymentService } from "@/services";
import { paymentSchema, PaymentFormValues, defaultPaymentValues } from "@/schemas/paymentSchema";
import { useNavigate } from "react-router-dom";
import { Member } from "@/types";

export const usePaymentForm = (paymentId?: string) => {
  const isEditMode = !!paymentId;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: defaultPaymentValues(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedMembers = await memberService.getAllMembers();
        setMembers(fetchedMembers);

        if (isEditMode && paymentId) {
          const payment = await paymentService.getPaymentById(paymentId);
          if (payment) {
            form.reset({
              memberId: payment.memberId,
              amount: payment.amount,
              month: payment.month,
              year: payment.year,
              isPaid: payment.isPaid,
              date: payment.date || "",
              paymentMethod: payment.paymentMethod || "",
              notes: payment.notes || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paymentId, isEditMode, form, toast]);

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      setSubmitLoading(true);
      
      // Make sure date is set if isPaid is true
      if (data.isPaid && !data.date) {
        data.date = new Date().toISOString().split("T")[0];
      }

      // Clear payment method if not paid
      if (!data.isPaid) {
        data.paymentMethod = "";
        data.date = "";
      }

      if (isEditMode && paymentId) {
        await paymentService.updatePayment({
          id: paymentId,
          memberId: data.memberId,
          amount: data.amount,
          month: data.month,
          year: data.year,
          isPaid: data.isPaid,
          date: data.date || "",
          paymentMethod: data.paymentMethod || undefined,
          notes: data.notes || undefined,
        });
        
        toast({
          title: "Pagamento atualizado",
          description: "As informações do pagamento foram atualizadas com sucesso",
        });
      } else {
        await paymentService.createPayment({
          memberId: data.memberId,
          amount: data.amount,
          month: data.month,
          year: data.year,
          isPaid: data.isPaid,
          date: data.date || "",
          paymentMethod: data.paymentMethod || undefined,
          notes: data.notes || undefined,
        });
        
        toast({
          title: "Pagamento criado",
          description: "O novo pagamento foi criado com sucesso",
        });
      }
      
      navigate("/payments");
    } catch (error) {
      console.error("Error saving payment:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o pagamento",
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const watchIsPaid = form.watch("isPaid");

  return {
    form,
    members,
    loading,
    isEditMode,
    submitLoading,
    onSubmit,
    watchIsPaid,
  };
};
