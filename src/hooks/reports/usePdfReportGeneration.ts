
import { useState } from "react";
import { Member } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { generateMembersPdfReport } from "@/services/pdf";
import { formatMonthYear } from "@/services/formatters";

export const usePdfReportGeneration = (
  selectedMonth: string,
  paidMembers: Member[],
  unpaidMembers: Member[]
) => {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const { toast } = useToast();

  const handleGeneratePdfReport = async (type: 'paid' | 'unpaid') => {
    try {
      setGeneratingPdf(true);
      const members = type === 'paid' ? paidMembers : unpaidMembers;
      const reportTitle = type === 'paid' 
        ? `Sócios em Dia - ${formatMonthYear(selectedMonth)}`
        : `Sócios Inadimplentes - ${formatMonthYear(selectedMonth)}`;
      
      await generateMembersPdfReport(members, reportTitle, formatMonthYear(selectedMonth));
      
      toast({
        title: "Relatório Gerado",
        description: `O relatório de ${type === 'paid' ? 'sócios em dia' : 'sócios inadimplentes'} foi gerado com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao gerar relatório PDF:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o relatório PDF.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  return {
    generatingPdf,
    handleGeneratePdfReport
  };
};
