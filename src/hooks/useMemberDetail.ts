
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { memberService, paymentService } from "@/services";
import { Member, MemberStatus, Payment } from "@/types";

export const useMemberDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<{
    upToDate: boolean;
    unpaidMonths: string[];
  }>({ upToDate: true, unpaidMonths: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate("/members");
        return;
      }

      try {
        setLoading(true);
        const fetchedMember = await memberService.getMemberById(id);
        
        if (!fetchedMember) {
          toast({
            title: "Erro",
            description: "Sócio não encontrado",
            variant: "destructive",
          });
          navigate("/members");
          return;
        }
        
        setMember(fetchedMember);
        
        const fetchedPayments = await paymentService.getPaymentsByMember(id);
        setPayments(fetchedPayments);
        
        const fetchedPaymentStatus = await paymentService.getMemberPaymentStatus(id);
        setPaymentStatus(fetchedPaymentStatus);
      } catch (error) {
        console.error("Error fetching member data:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os dados do sócio",
          variant: "destructive",
        });
        navigate("/members");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await memberService.deleteMember(id);
      toast({
        title: "Sócio excluído",
        description: "O sócio foi excluído com sucesso",
      });
      navigate("/members");
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o sócio",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (newStatus: MemberStatus) => {
    if (!member) return;
    
    try {
      const updatedMember = await memberService.updateMember({
        ...member,
        status: newStatus
      });
      
      if (updatedMember) {
        setMember(updatedMember);
      }
      
      toast({
        title: "Status atualizado",
        description: `O status foi alterado para ${newStatus}`,
      });
      
      setShowStatusDialog(false);
    } catch (error) {
      console.error("Error updating member status:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status",
        variant: "destructive",
      });
    }
  };

  return {
    member,
    payments,
    paymentStatus,
    loading,
    showDeleteDialog,
    showStatusDialog,
    setShowDeleteDialog,
    setShowStatusDialog,
    handleDelete,
    handleStatusChange,
  };
};
