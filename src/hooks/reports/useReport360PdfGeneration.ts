
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateReport360Pdf } from "@/services/pdf";
import { formatMonthYear } from "@/services/formatters";

export const useReport360PdfGeneration = (
  selectedMonth: string,
  memberStatusData: { name: string; value: number; color: string }[],
  paymentStatusData: { name: string; value: number; color: string }[],
  expensesData: { name: string; value: number; color: string }[],
  financialSummary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  }
) => {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const { toast } = useToast();

  const handleGeneratePdfReport = async () => {
    try {
      setGeneratingPdf(true);
      
      const reportTitle = `Relatório 360° - ${formatMonthYear(selectedMonth)}`;
      
      await generateReport360Pdf(
        reportTitle, 
        formatMonthYear(selectedMonth),
        memberStatusData,
        paymentStatusData,
        expensesData,
        financialSummary
      );
      
      toast({
        title: "Relatório Gerado",
        description: "O relatório 360° foi gerado com sucesso.",
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
