
import { useState, useEffect } from "react";
import { Member, Payment, MonthlyRecord } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { memberService, paymentService } from "@/services";
import { formatMonthYear, getCurrentMonthYear } from "@/services/formatters";

export const useReportsData = () => {
  const currentDate = getCurrentMonthYear();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.month);
  const [selectedYear, setSelectedYear] = useState(currentDate.year.toString());
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [monthlyPayments, setMonthlyPayments] = useState<Payment[]>([]);
  const [monthlyRecord, setMonthlyRecord] = useState<MonthlyRecord>({
    month: "",
    year: 0,
    totalMembers: 0,
    paidMembers: 0,
    unpaidMembers: 0,
    totalAmount: 0,
    collectedAmount: 0,
  });
  const [paidMembers, setPaidMembers] = useState<Member[]>([]);
  const [unpaidMembers, setUnpaidMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingPayments, setGeneratingPayments] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const { toast } = useToast();

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthStr = String(month).padStart(2, "0");
    const date = new Date(parseInt(selectedYear), i);
    return {
      value: `${selectedYear}-${monthStr}`,
      label: date.toLocaleDateString("pt-BR", { month: "long" }),
    };
  });

  // Generate year options
  const yearOptions = Array.from(
    { length: 7 },
    (_, i) => (currentDate.year - 5 + i).toString()
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data
        const fetchedMembers = await memberService.getAllMembers();
        const fetchedPayments = await paymentService.getAllPayments();
        const fetchedMonthlyRecord = await paymentService.getMonthlyRecord(
          selectedMonth,
          parseInt(selectedYear)
        );
        
        setAllMembers(fetchedMembers);
        setAllPayments(fetchedPayments);
        setMonthlyRecord(fetchedMonthlyRecord);
        
        // Filter payments by selected month
        const monthPayments = fetchedPayments.filter(
          (payment) => payment.month === selectedMonth
        );
        setMonthlyPayments(monthPayments);
        
        // Filter members by payment status
        const membersPaid = fetchedMembers.filter((member) => {
          const memberPayments = monthPayments.filter(p => p.memberId === member.id);
          return memberPayments.some(p => p.isPaid);
        });
        setPaidMembers(membersPaid);
        
        const membersUnpaid = fetchedMembers.filter((member) => {
          const memberPayments = monthPayments.filter(p => p.memberId === member.id);
          return memberPayments.length === 0 || memberPayments.every(p => !p.isPaid);
        });
        setUnpaidMembers(membersUnpaid);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    // Update month with new year
    const [_, month] = selectedMonth.split("-");
    setSelectedMonth(`${value}-${month}`);
  };

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
        
        // Recarregar os dados para exibir os novos pagamentos
        const fetchedMembers = await memberService.getAllMembers();
        const fetchedPayments = await paymentService.getAllPayments();
        const fetchedMonthlyRecord = await paymentService.getMonthlyRecord(
          selectedMonth,
          parseInt(selectedYear)
        );
        
        setAllMembers(fetchedMembers);
        setAllPayments(fetchedPayments);
        setMonthlyRecord(fetchedMonthlyRecord);
        
        // Filter payments by selected month
        const monthPayments = fetchedPayments.filter(
          (payment) => payment.month === selectedMonth
        );
        setMonthlyPayments(monthPayments);
        
        // Filter members by payment status
        const membersPaid = fetchedMembers.filter((member) => {
          const memberPayments = monthPayments.filter(p => p.memberId === member.id);
          return memberPayments.some(p => p.isPaid);
        });
        setPaidMembers(membersPaid);
        
        const membersUnpaid = fetchedMembers.filter((member) => {
          const memberPayments = monthPayments.filter(p => p.memberId === member.id);
          return memberPayments.length === 0 || memberPayments.every(p => !p.isPaid);
        });
        setUnpaidMembers(membersUnpaid);
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
    selectedMonth,
    selectedYear,
    monthOptions,
    yearOptions,
    monthlyRecord,
    allMembers,
    unpaidMembers,
    paidMembers,
    loading,
    generatingPayments,
    generatingPdf,
    handleMonthChange,
    handleYearChange,
    handleGeneratePendingPayments,
    handleGeneratePdfReport,
    formatMonthYear
  };
};

// Import the PDF generation function
import { generateMembersPdfReport } from "@/services/pdfService";
