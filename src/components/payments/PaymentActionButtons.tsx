
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Edit, Trash2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Payment } from "@/types";

interface PaymentActionButtonsProps {
  payment: Payment;
  actionLoading: boolean;
  onTogglePaid: () => void;
  onShowDeleteDialog: () => void;
}

export function PaymentActionButtons({
  payment,
  actionLoading,
  onTogglePaid,
  onShowDeleteDialog,
}: PaymentActionButtonsProps) {
  const navigate = useNavigate();

  return (
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
        onClick={onTogglePaid}
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
        onClick={onShowDeleteDialog}
        disabled={actionLoading}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Excluir Pagamento
      </Button>
    </div>
  );
}
