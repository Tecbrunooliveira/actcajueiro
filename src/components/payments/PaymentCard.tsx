
import React from "react";
import { Payment } from "@/types";
import { formatCurrency, formatMonthYear } from "@/services/formatters";
import { CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentCardProps {
  payment: Payment;
  memberName?: string;
  onClick?: () => void;
}

export function PaymentCard({
  payment,
  memberName,
  onClick,
}: PaymentCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md p-4 mb-4",
        onClick && "cursor-pointer hover:shadow-lg transition-shadow"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          {memberName && (
            <h3 className="font-bold text-base mb-1">{memberName}</h3>
          )}
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {formatMonthYear(payment.month, false)}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
            payment.isPaid
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          )}
        >
          {payment.isPaid ? (
            <>
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Pago</span>
            </>
          ) : (
            <>
              <XCircle className="h-3.5 w-3.5" />
              <span>Pendente</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-lg font-semibold">{formatCurrency(payment.amount)}</p>
        {payment.isPaid && payment.paymentMethod && (
          <p className="text-sm text-gray-600 mt-1">
            Via {payment.paymentMethod}
          </p>
        )}
        {payment.notes && (
          <p className="text-sm text-gray-600 mt-1">{payment.notes}</p>
        )}
      </div>
    </div>
  );
}
