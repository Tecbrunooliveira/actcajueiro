
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { memberService, paymentService } from "@/services";
import { Member, Payment } from "@/types";

export const usePaymentDetail = (paymentId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!paymentId) {
        navigate("/payments");
        return;
      }

      try {
        setLoading(true);
        const fetchedPayment = await paymentService.getPaymentById(paymentId);
        
        if (!fetchedPayment) {
          toast({
            title: "Erro",
            description: "Pagamento não encontrado",
            variant: "destructive",
          });
          navigate("/payments");
          return;
        }
        
        setPayment(fetchedPayment);
        
        if (fetchedPayment.memberId) {
          const fetchedMember = await memberService.getMemberById(fetchedPayment.memberId);
          setMember(fetchedMember || null);
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do pagamento",
          variant: "destructive",
        });
        navigate("/payments");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paymentId, navigate, toast]);

  const handleTogglePaid = async () => {
    if (!payment || !paymentId) return;
    
    try {
      setActionLoading(true);
      
      const updatedPayment = {
        ...payment,
        isPaid: !payment.isPaid,
        date: !payment.isPaid ? new Date().toISOString().split("T")[0] : "",
      };
      
      await paymentService.updatePayment(updatedPayment);
      
      setPayment(updatedPayment);
      
      toast({
        title: payment.isPaid ? "Pagamento desmarcado" : "Pagamento marcado como pago",
        description: payment.isPaid 
          ? "O pagamento foi desmarcado como pago"
          : "O pagamento foi marcado como pago",
      });
    } catch (error) {
      console.error("Error toggling payment status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pagamento",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!paymentId) return;
    
    try {
      setActionLoading(true);
      await paymentService.deletePayment(paymentId);
      
      toast({
        title: "Pagamento excluído",
        description: "O pagamento foi excluído com sucesso",
      });
      
      navigate("/payments");
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o pagamento",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return {
    payment,
    member,
    loading,
    actionLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    handleTogglePaid,
    handleDelete,
  };
};
