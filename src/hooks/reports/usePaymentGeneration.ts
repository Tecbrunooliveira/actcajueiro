
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { paymentService } from "@/services";
import { formatMonthYear } from "@/services/formatters";

export const usePaymentGeneration = (
  selectedMonth: string, 
  selectedYear: string,
  refreshData: () => Promise<void>
) => {
  const [generatingPayments, setGeneratingPayments] = useState(false);
  const { toast } = useToast();

  const handleGeneratePendingPayments = async () => {
    try {
      setGeneratingPayments(true);
      
      const count = await paymentService.generatePendingPaymentsForMonth(
        selectedMonth,
        parseInt(selectedYear)
      );
      
      if (count > 0) {
        toast({
          title: "Pagamentos Gerados",
          description: `${count} pagamentos pendentes foram gerados para ${formatMonthYear(selectedMonth)}.`,
        });
        
        // Refresh data to show the new payments
        await refreshData();
      } else {
        toast({
          title: "Sem novos pagamentos",
          description: "Todos os sócios frequentantes já possuem pagamentos registrados para este mês.",
        });
      }
    } catch (error) {
      console.error("Erro ao gerar pagamentos pendentes:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar os pagamentos pendentes.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPayments(false);
    }
  };

  return {
    generatingPayments,
    handleGeneratePendingPayments
  };
};
