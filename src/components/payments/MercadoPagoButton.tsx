
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Payment } from "@/types";
import { toast } from "sonner";
import { DollarSign, AlertTriangle } from "lucide-react";

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

      if (error) {
        console.error('Error invoking mercadopago function:', error);
        throw error;
      }

      if (!data || !data.init_point) {
        throw new Error('Resposta inválida do Mercado Pago');
      }

      // Redireciona para o checkout do Mercado Pago
      window.open(data.init_point, '_blank');
      
      toast.success('Link de pagamento gerado', {
        description: 'Use o link aberto em nova aba para realizar o pagamento'
      });
      
    } catch (error) {
      console.error('Error creating payment:', error);
      
      // Mensagem de erro mais amigável
      let errorMessage = 'Erro ao processar pagamento';
      if (error instanceof Error) {
        if (error.message.includes('invalid_token')) {
          errorMessage = 'Erro de configuração do Mercado Pago. Por favor, contate o administrador.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Tempo esgotado. Verifique sua conexão e tente novamente.';
        } else if (error.message.includes('same')) {
          errorMessage = 'Não é possível pagar para você mesmo. Use outro método de pagamento.';
        }
      }
      
      toast.error(errorMessage, {
        description: 'Tente novamente mais tarde ou use outro método de pagamento',
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />
      });
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
