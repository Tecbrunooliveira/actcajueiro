
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PaymentCard } from "@/components/payments/PaymentCard";
import { Payment } from "@/types";

interface PaymentsListProps {
  payments: Payment[];
  memberId: string;
  memberName: string;
  memberPhoto?: string;
}

export function PaymentsList({ payments, memberId, memberName, memberPhoto }: PaymentsListProps) {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Histórico de Pagamentos</h3>
        <Button
          size="sm"
          variant="outline"
          className="text-club-500 border-club-500 hover:bg-club-50"
          onClick={() => navigate(`/payments/new?memberId=${memberId}`)}
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
                memberName={memberName}
                memberPhoto={memberPhoto}
                onClick={() => navigate(`/payments/${payment.id}`)}
              />
            ))}
        </div>
      )}
    </div>
  );
}
