
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  memberService,
  paymentService,
  formatCurrency,
  formatMonthYear,
} from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Member, Payment } from "@/types";

const PaymentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate("/payments");
        return;
      }

      try {
        setLoading(true);
        const fetchedPayment = await paymentService.getPaymentById(id);
        
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
  }, [id, navigate, toast]);

  const handleTogglePaid = async () => {
    if (!payment || !id) return;
    
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
    if (!id) return;
    
    try {
      setActionLoading(true);
      await paymentService.deletePayment(id);
      
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

  if (loading) {
    return (
      <MobileLayout title="Detalhes do Pagamento">
        <div className="flex items-center justify-center h-full py-10">
          <p>Carregando detalhes...</p>
        </div>
      </MobileLayout>
    );
  }

  if (!payment) {
    return null;
  }

  return (
    <MobileLayout title="Detalhes do Pagamento">
      <div className="space-y-6">
        {/* Payment status card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold">
                {formatMonthYear(payment.month)}
              </h2>
              <div
                className={cn(
                  "flex items-center px-3 py-1 rounded-full text-sm font-medium",
                  payment.isPaid
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {payment.isPaid ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Pago</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    <span>Pendente</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <DollarSign className="h-5 w-5 mr-3 text-gray-400" />
                <span className="text-lg font-semibold">
                  {formatCurrency(payment.amount)}
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <User className="h-5 w-5 mr-3 text-gray-400" />
                <span>
                  {member ? member.name : "Sócio desconhecido"}
                </span>
              </div>

              {payment.isPaid && payment.date && (
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                  <span>
                    Pago em {new Date(payment.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}

              {payment.isPaid && payment.paymentMethod && (
                <div className="flex items-start text-gray-700">
                  <span className="mr-3 text-gray-400 w-5">💳</span>
                  <span>Forma de pagamento: {payment.paymentMethod}</span>
                </div>
              )}
            </div>

            {payment.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md text-gray-700 text-sm">
                {payment.notes}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            className="w-full bg-club-500 hover:bg-club-600"
            onClick={() => navigate(`/payments/edit/${payment.id}`)}
            disabled={actionLoading}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Pagamento
          </Button>

          <Button
            variant={payment.isPaid ? "destructive" : "default"}
            className={cn(
              "w-full",
              !payment.isPaid && "bg-green-600 hover:bg-green-700"
            )}
            onClick={handleTogglePaid}
            disabled={actionLoading}
          >
            {payment.isPaid ? (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Desmarcar como Pago
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Pago
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full text-red-500 border-red-200 hover:bg-red-50"
            onClick={() => setShowDeleteDialog(true)}
            disabled={actionLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Pagamento
          </Button>
        </div>

        {/* Delete confirmation dialog */}
        <AlertDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este pagamento? Esta ação não
                pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={actionLoading}>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MobileLayout>
  );
};

export default PaymentDetail;
