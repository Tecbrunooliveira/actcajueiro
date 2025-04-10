
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MemberCard } from "@/components/members/MemberCard";
import { Member, Payment, MonthlyRecord } from "@/types";
import {
  memberService,
  paymentService,
  formatCurrency,
  formatMonthYear,
  getCurrentMonthYear,
} from "@/services/dataService";
import { CheckCircle, Download, PlusCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { generateMembersPdfReport } from "@/services/pdfService";

const Reports = () => {
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

  // Generate year options (current year - 5 to current year + 1)
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

  if (loading) {
    return (
      <MobileLayout title="Relatórios">
        <div className="flex items-center justify-center h-full py-10">
          <p>Carregando dados...</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Relatórios">
      <div className="space-y-6">
        {/* Period selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="year">Ano</Label>
                <Select value={selectedYear} onValueChange={handleYearChange}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="month">Mês</Label>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={handleGeneratePendingPayments}
                disabled={generatingPayments}
                className="w-full bg-club-500 hover:bg-club-600"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {generatingPayments 
                  ? "Gerando pagamentos..." 
                  : "Gerar Pagamentos Pendentes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Sócios</div>
              <div className="text-2xl font-bold">{allMembers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Pagamentos</div>
              <div className="text-2xl font-bold">
                {monthlyRecord.paidMembers}/{monthlyRecord.totalMembers}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Valor Total</div>
              <div className="text-xl font-bold">{formatCurrency(monthlyRecord.totalAmount)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Recebido</div>
              <div className="text-xl font-bold">{formatCurrency(monthlyRecord.collectedAmount)}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Detailed reports */}
        <Tabs defaultValue="unpaid" className="mt-8">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="unpaid">Inadimplentes</TabsTrigger>
            <TabsTrigger value="paid">Em Dia</TabsTrigger>
          </TabsList>
          
          <TabsContent value="unpaid">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <XCircle className="h-5 w-5 mr-2 text-red-500" />
                Sócios Inadimplentes
              </h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-red-500">
                  {unpaidMembers.length} sócios
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleGeneratePdfReport('unpaid')}
                  disabled={generatingPdf || unpaidMembers.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
            
            {unpaidMembers.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                Nenhum sócio inadimplente para o período selecionado.
              </p>
            ) : (
              <div className="space-y-3">
                {unpaidMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="paid">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Sócios em Dia
              </h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-green-500">
                  {paidMembers.length} sócios
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleGeneratePdfReport('paid')}
                  disabled={generatingPdf || paidMembers.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
            
            {paidMembers.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                Nenhum sócio com pagamento em dia para o período selecionado.
              </p>
            ) : (
              <div className="space-y-3">
                {paidMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Reports;
