
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Edit, Trash2, XCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Payment, Member } from "@/types";
import { openWhatsAppWithTemplate } from "@/services/communicationService";

interface PaymentActionButtonsProps {
  payment: Payment;
  member?: Member;
  actionLoading: boolean;
  onTogglePaid: () => void;
  onShowDeleteDialog: () => void;
}

export function PaymentActionButtons({
  payment,
  member,
  actionLoading,
  onTogglePaid,
  onShowDeleteDialog,
}: PaymentActionButtonsProps) {
  const navigate = useNavigate();

  const handleWhatsAppClick = () => {
    if (member?.phone) {
      // Se o pagamento não está pago, usar template de lembrete
      if (!payment.isPaid) {
        openWhatsAppWithTemplate(member.phone, "payment_reminder");
      } else {
        openWhatsAppWithTemplate(member.phone, "general");
      }
    }
  };

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

      {member?.phone && (
        <Button
          className="w-full bg-green-500 hover:bg-green-600"
          onClick={handleWhatsAppClick}
          disabled={actionLoading}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
      )}

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
