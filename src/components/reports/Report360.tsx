
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberStatusChart } from "./charts/MemberStatusChart";
import { PaymentStatusChart } from "./charts/PaymentStatusChart";
import { ExpenseCategoryChart } from "./charts/ExpenseCategoryChart";
import { FinancialSummary } from "./charts/FinancialSummary";
import { useReport360PdfGeneration } from "@/hooks/reports/useReport360PdfGeneration";

export const Report360 = ({
  memberStatusData,
  paymentStatusData,
  expensesData,
  financialSummary,
  selectedMonth,
  formatMonthYear,
}: {
  memberStatusData: { name: string; value: number; color: string }[];
  paymentStatusData: { name: string; value: number; color: string }[];
  expensesData: { name: string; value: number; color: string }[];
  financialSummary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
  selectedMonth: string;
  formatMonthYear: (month: string) => string;
}) => {
  const { generatingPdf, handleGeneratePdfReport } = useReport360PdfGeneration(
    selectedMonth,
    memberStatusData,
    paymentStatusData,
    expensesData,
    financialSummary
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            Relatório 360° - {formatMonthYear(selectedMonth)}
          </CardTitle>
          <Button 
            size="sm" 
            onClick={handleGeneratePdfReport} 
            disabled={generatingPdf}
            className="ml-auto"
          >
            <FileDown className="mr-2 h-4 w-4" />
            {generatingPdf ? "Gerando..." : "Exportar PDF"}
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Resumo</TabsTrigger>
              <TabsTrigger value="members">Sócios</TabsTrigger>
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
              <TabsTrigger value="expenses">Despesas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="pt-4">
              <FinancialSummary data={financialSummary} />
            </TabsContent>
            
            <TabsContent value="members" className="pt-4">
              <MemberStatusChart data={memberStatusData} />
            </TabsContent>
            
            <TabsContent value="payments" className="pt-4">
              <PaymentStatusChart data={paymentStatusData} />
            </TabsContent>
            
            <TabsContent value="expenses" className="pt-4">
              <ExpenseCategoryChart data={expensesData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
