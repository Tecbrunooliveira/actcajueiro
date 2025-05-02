
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Calendar, CheckCircle, XCircle, User } from "lucide-react";
import { Payment, Member } from "@/types";
import { formatCurrency, formatMonthYear } from "@/services/formatters";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PaymentInfoCardProps {
  payment: Payment;
  member: Member | null;
}

export function PaymentInfoCard({ payment, member }: PaymentInfoCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            {member && (
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.photo} alt={member.name} />
                <AvatarFallback className="bg-gray-200">
                  <User className="h-6 w-6 text-gray-400" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div>
              {member && (
                <h2 className="text-xl font-bold mb-1">{member.name}</h2>
              )}
              <p className="text-gray-600">
                {formatMonthYear(payment.month)}
              </p>
            </div>
          </div>
          
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
  );
}
