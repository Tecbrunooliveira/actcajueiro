
import React, { useState } from "react";
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

const PaymentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!id) {
    navigate("/payments");
    return null;
  }

  const payment = paymentService.getPaymentById(id);
  if (!payment) {
    navigate("/payments");
    return null;
  }

  const member = memberService.getMemberById(payment.memberId);
  
  const handleTogglePaid = () => {
    const updatedPayment = {
      ...payment,
      isPaid: !payment.isPaid,
      date: !payment.isPaid ? new Date().toISOString().split("T")[0] : "",
    };
    paymentService.updatePayment(updatedPayment);
    toast({
      title: payment.isPaid ? "Pagamento desmarcado" : "Pagamento marcado como pago",
      description: payment.isPaid 
        ? "O pagamento foi desmarcado como pago"
        : "O pagamento foi marcado como pago",
    });
    navigate(`/payments/${id}`);
  };

  const handleDelete = () => {
    paymentService.deletePayment(id);
    toast({
      title: "Pagamento excluído",
      description: "O pagamento foi excluído com sucesso",
    });
    navigate("/payments");
  };

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

export default PaymentDetail;
