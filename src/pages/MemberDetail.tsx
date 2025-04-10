
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaymentCard } from "@/components/payments/PaymentCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { memberService, paymentService } from "@/services";
import { getStatusColor, getStatusLabel } from "@/services/formatters";
import { Member, MemberStatus, Payment } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
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
        description: `O status foi alterado para ${getStatusLabel(newStatus)}`,
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

  if (loading) {
    return (
      <MobileLayout title="Detalhes do Sócio">
        <div className="flex items-center justify-center h-full py-10">
          <p>Carregando dados...</p>
        </div>
      </MobileLayout>
    );
  }

  if (!member) {
    return null;
  }

  return (
    <MobileLayout title="Detalhes do Sócio">
      <div className="space-y-6">
        {/* Member info card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={member.photo} alt={member.name} />
                <AvatarFallback className="bg-gray-200">
                  <User className="h-8 w-8 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">{member.name}</h2>
                  <Badge
                    className={cn(
                      "ml-2",
                      member.status === "frequentante"
                        ? "bg-green-500"
                        : member.status === "afastado"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    )}
                  >
                    {getStatusLabel(member.status)}
                  </Badge>
                </div>

                <div className="space-y-3 mt-2">
                  {member.email && (
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-5 w-5 mr-3 text-gray-400" />
                      <span>{member.email}</span>
                    </div>
                  )}

                  {member.phone && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <span>{member.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                    <span>
                      Associado desde{" "}
                      {new Date(member.joinDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {member.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md text-gray-700 text-sm">
                {member.notes}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment status */}
        <div
          className={cn(
            "p-4 rounded-lg",
            paymentStatus.upToDate
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          )}
        >
          <div className="flex items-center space-x-2">
            {paymentStatus.upToDate ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            <h3
              className={cn(
                "font-medium",
                paymentStatus.upToDate ? "text-green-700" : "text-red-700"
              )}
            >
              {paymentStatus.upToDate
                ? "Pagamentos em dia"
                : "Pagamentos pendentes"}
            </h3>
          </div>
          {!paymentStatus.upToDate && (
            <div className="mt-2 text-sm text-red-600">
              <p>Meses pendentes:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {paymentStatus.unpaidMonths.map((month) => (
                  <Badge
                    key={month}
                    variant="outline"
                    className="border-red-300 text-red-700"
                  >
                    {month.split("-")[1]}/{month.split("-")[0]}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payments section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Histórico de Pagamentos</h3>
            <Button
              size="sm"
              variant="outline"
              className="text-club-500 border-club-500 hover:bg-club-50"
              onClick={() => navigate(`/payments/new?memberId=${member.id}`)}
            >
              Novo Pagamento
            </Button>
          </div>

          {payments.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              Nenhum pagamento registrado
            </p>
          ) : (
            <div className="space-y-3">
              {payments
                .sort(
                  (a, b) =>
                    new Date(b.month).getTime() - new Date(a.month).getTime()
                )
                .map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    memberName={member.name}
                    memberPhoto={member.photo}
                    onClick={() => navigate(`/payments/${payment.id}`)}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 py-6">
          <Button
            className="flex-1 bg-club-500 hover:bg-club-600"
            onClick={() => navigate(`/members/edit/${member.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowStatusDialog(true)}
          >
            <User className="h-4 w-4 mr-2" />
            Status
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Status change dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar Status</DialogTitle>
              <DialogDescription>
                Selecione o novo status para o sócio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <Button
                variant="outline"
                className="w-full justify-start text-green-700"
                onClick={() => handleStatusChange("frequentante")}
              >
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                Frequentante
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-amber-700"
                onClick={() => handleStatusChange("afastado")}
              >
                <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                Afastado
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-700"
                onClick={() => handleStatusChange("advertido")}
              >
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                Advertido
              </Button>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowStatusDialog(false)}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation dialog */}
        <AlertDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este sócio? Esta ação não pode
                ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MobileLayout>
  );
};

export default MemberDetail;
