
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MemberCard } from "@/components/members/MemberCard";
import { Member, Payment, MonthlyRecord } from "@/types";
import {
  memberService,
  paymentService,
  formatCurrency,
  formatMonthYear,
  getCurrentMonthYear,
} from "@/services/dataService";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Prepare data for pie chart
  const paymentStatusData = [
    { name: "Pagos", value: paidMembers.length, color: "#22c55e" },
    { name: "Pendentes", value: unpaidMembers.length, color: "#ef4444" },
  ];

  // Prepare data for status pie chart
  const memberStatusData = [
    {
      name: "Frequentantes",
      value: allMembers.filter((m) => m.status === "frequentante").length,
      color: "#22c55e",
    },
    {
      name: "Afastados",
      value: allMembers.filter((m) => m.status === "afastado").length,
      color: "#f59e0b",
    },
    {
      name: "Advertidos",
      value: allMembers.filter((m) => m.status === "advertido").length,
      color: "#ef4444",
    },
  ];

  // Prepare data for payment history
  const paymentHistoryData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(parseInt(selectedYear), parseInt(selectedMonth.split("-")[1]) - 1);
    date.setMonth(date.getMonth() - 5 + i);
    
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = date.toLocaleDateString("pt-BR", { month: "short" });
    
    const monthPayments = allPayments.filter(p => p.month === month);
    const paidCount = new Set(monthPayments.filter(p => p.isPaid).map(p => p.memberId)).size;
    const totalCount = allMembers.length;
    
    return {
      name: monthLabel,
      paidCount,
      unpaidCount: totalCount - paidCount,
      month,
    };
  });

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    // Update month with new year
    const [_, month] = selectedMonth.split("-");
    setSelectedMonth(`${value}-${month}`);
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
        
        {/* Charts */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Status de Pagamentos</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} sócios`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Status dos Sócios</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={memberStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {memberStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} sócios`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Histórico de Pagamentos</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="paidCount" name="Pagos" fill="#22c55e" />
                    <Bar dataKey="unpaidCount" name="Pendentes" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
              <Badge variant="outline" className="text-red-500">
                {unpaidMembers.length} sócios
              </Badge>
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
              <Badge variant="outline" className="text-green-500">
                {paidMembers.length} sócios
              </Badge>
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
