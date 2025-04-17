
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Payment } from "@/types";
import { toast } from "sonner";
import { DollarSign } from "lucide-react";

interface MercadoPagoButtonProps {
  payment: Payment | Partial<Payment>;
  disabled?: boolean;
  showIcon?: boolean;
}

export function MercadoPagoButton({ payment, disabled, showIcon = false }: MercadoPagoButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      if (!payment.amount || !payment.memberId) {
        toast.error('Dados de pagamento incompletos');
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('mercadopago', {
        body: {
          amount: payment.amount,
          description: payment.month && payment.year 
            ? `Pagamento ${payment.month}/${payment.year}`
            : 'Pagamento',
          memberId: payment.memberId,
        },
      });

      if (error) throw error;

      // Redireciona para o checkout do Mercado Pago
      window.location.href = data.init_point;
      
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || loading}
      className="w-full bg-[#009ee3] hover:bg-[#007eb5]"
    >
      {loading ? 'Processando...' : (
        <>
          {showIcon && <DollarSign className="h-4 w-4 mr-2" />}
          Pagar com Mercado Pago
        </>
      )}
    </Button>
  );
}
