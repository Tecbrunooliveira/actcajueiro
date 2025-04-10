
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
import { 
  CheckCircle, 
  Download, 
  PlusCircle, 
  XCircle, 
  AlertTriangle,
  CalendarRange,
  Users,
  DollarSign,
  Wallet,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { generateMembersPdfReport } from "@/services/pdfService";
import { Progress } from "@/components/ui/progress";

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

  // Calcular a porcentagem de pagamentos para a barra de progresso
  const paymentPercentage = monthlyRecord.totalMembers > 0
    ? Math.round((monthlyRecord.paidMembers / monthlyRecord.totalMembers) * 100)
    : 0;
    
  // Calcular a porcentagem de valores coletados para a barra de progresso
  const collectedPercentage = monthlyRecord.totalAmount > 0
    ? Math.round((monthlyRecord.collectedAmount / monthlyRecord.totalAmount) * 100)
    : 0;

  if (loading) {
    return (
      <MobileLayout title="Relatórios">
        <div className="flex items-center justify-center h-full py-10">
          <div className="text-center space-y-4">
            <BarChart3 className="h-10 w-10 mx-auto animate-pulse text-primary" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Relatórios">
      <div className="space-y-6">
        {/* Period selector com visual mais moderno */}
        <Card className="overflow-hidden border-none shadow-md">
          <div className="bg-club-500 px-4 py-3 text-white">
            <div className="flex items-center">
              <CalendarRange className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Período</h3>
            </div>
          </div>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year" className="text-sm text-muted-foreground mb-1.5 block">Ano</Label>
                <Select value={selectedYear} onValueChange={handleYearChange}>
                  <SelectTrigger id="year" className="w-full border-gray-200 focus:border-club-400 focus:ring-club-400">
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
                <Label htmlFor="month" className="text-sm text-muted-foreground mb-1.5 block">Mês</Label>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                  <SelectTrigger id="month" className="w-full border-gray-200 focus:border-club-400 focus:ring-club-400">
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
            </div>
            
            <Button
              onClick={handleGeneratePendingPayments}
              disabled={generatingPayments}
              className="w-full bg-club-500 hover:bg-club-600 transition-all"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {generatingPayments 
                ? "Gerando pagamentos..." 
                : "Gerar Pagamentos Pendentes"}
            </Button>
          </CardContent>
        </Card>

        {/* Dashboard com estatísticas */}
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-club-500" />
              Dashboard {formatMonthYear(selectedMonth)}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Sócios</p>
                    <p className="text-2xl font-bold">{allMembers.length}</p>
                  </div>
                  <div className="bg-club-100 p-2 rounded-full">
                    <Users className="h-4 w-4 text-club-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground">Pagamentos</p>
                    <p className="text-2xl font-bold">
                      {monthlyRecord.paidMembers}/{monthlyRecord.totalMembers}
                    </p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={paymentPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{paymentPercentage}% pagos</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground">Valor Total</p>
                    <p className="text-xl font-bold">{formatCurrency(monthlyRecord.totalAmount)}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground">Recebido</p>
                    <p className="text-xl font-bold">{formatCurrency(monthlyRecord.collectedAmount)}</p>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Wallet className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={collectedPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{collectedPercentage}% recebidos</p>
                </div>
              </div>
            </div>
            
            {/* Alerta se tiver muitos inadimplentes */}
            {unpaidMembers.length > 5 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Atenção</p>
                  <p className="text-xs text-amber-700">
                    Existem {unpaidMembers.length} sócios inadimplentes este mês. Considere enviar um lembrete.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Detailed reports com tabs mais bonitas */}
        <Tabs defaultValue="unpaid" className="mt-8">
          <TabsList className="grid grid-cols-2 mb-4 p-1 bg-muted rounded-lg">
            <TabsTrigger 
              value="unpaid" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-club-700 data-[state=active]:shadow-sm transition-all"
            >
              <XCircle className="h-4 w-4 mr-2 text-red-500" />
              Inadimplentes
            </TabsTrigger>
            <TabsTrigger 
              value="paid" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-club-700 data-[state=active]:shadow-sm transition-all"
            >
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Em Dia
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unpaid" className="space-y-4 animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <XCircle className="h-5 w-5 mr-2 text-red-500" />
                Sócios Inadimplentes
              </h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200">
                  {unpaidMembers.length} sócios
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleGeneratePdfReport('unpaid')}
                  disabled={generatingPdf || unpaidMembers.length === 0}
                  className="hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
            
            {unpaidMembers.length === 0 ? (
              <div className="bg-gray-50 rounded-lg py-12 text-center">
                <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-gray-500 mb-2">
                  Nenhum sócio inadimplente para o período selecionado.
                </p>
                <p className="text-xs text-gray-400">
                  Todos os pagamentos estão em dia!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {unpaidMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="paid" className="space-y-4 animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Sócios em Dia
              </h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-500 border-green-200">
                  {paidMembers.length} sócios
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleGeneratePdfReport('paid')}
                  disabled={generatingPdf || paidMembers.length === 0}
                  className="hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
            
            {paidMembers.length === 0 ? (
              <div className="bg-gray-50 rounded-lg py-12 text-center">
                <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                </div>
                <p className="text-gray-500 mb-2">
                  Nenhum sócio com pagamento em dia para o período selecionado.
                </p>
                <p className="text-xs text-gray-400">
                  Utilize o botão "Gerar Pagamentos Pendentes" acima.
                </p>
              </div>
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
