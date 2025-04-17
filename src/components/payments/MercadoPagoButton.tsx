
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Payment } from "@/types";
import { toast } from "sonner";

interface MercadoPagoButtonProps {
  payment: Payment;
  disabled?: boolean;
}

export function MercadoPagoButton({ payment, disabled }: MercadoPagoButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('mercadopago', {
        body: {
          amount: payment.amount,
          description: `Pagamento ${payment.month}/${payment.year}`,
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
      {loading ? 'Processando...' : 'Pagar com Mercado Pago'}
    </Button>
  );
}
