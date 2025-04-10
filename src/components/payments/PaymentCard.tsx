
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Payment } from "@/types";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDateBR } from "@/services/formatters";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openWhatsAppWithTemplate } from "@/services/communicationService";

interface PaymentCardProps {
  payment: Payment;
  memberName?: string;
  memberPhoto?: string;
  memberPhone?: string;
  onClick?: () => void;
}

export function PaymentCard({ 
  payment, 
  memberName, 
  memberPhoto,
  memberPhone,
  onClick 
}: PaymentCardProps) {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    // Prevent triggering the card click
    e.stopPropagation();
    
    if (memberPhone) {
      // Se o pagamento não está pago, usar template de lembrete
      if (!payment.isPaid) {
        openWhatsAppWithTemplate(memberPhone, "payment_reminder");
      } else {
        openWhatsAppWithTemplate(memberPhone, "general");
      }
    }
  };

  return (
    <Card 
      className={cn(
        "hover:bg-gray-50 transition-colors cursor-pointer relative",
        payment.isPaid ? "border-green-100" : "border-red-100"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10 border">
            {memberPhoto ? (
              <AvatarImage src={memberPhoto} alt={memberName} />
            ) : (
              <AvatarFallback className="bg-club-50 text-club-600">
                {memberName?.charAt(0) || "?"}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{memberName || "Sócio Desconhecido"}</p>
            <p className="text-xs text-gray-500">{formatDateBR(payment.month)}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className="font-medium">{formatCurrency(payment.amount)}</span>
          <Badge variant="outline" className={
            payment.isPaid 
              ? "bg-green-50 text-green-600 border-green-200" 
              : "bg-red-50 text-red-600 border-red-200"
          }>
            {payment.isPaid ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <AlertCircle className="h-3 w-3 mr-1" />
            )}
            {payment.isPaid ? "Pago" : "Pendente"}
          </Badge>
        </div>
        
        {memberPhone && !payment.isPaid && (
          <Button
            size="sm"
            className="absolute top-2 right-2 bg-green-500 hover:bg-green-600"
            onClick={handleWhatsAppClick}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
