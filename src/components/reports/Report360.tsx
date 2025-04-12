
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, BarChart2, Users, CreditCard, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberStatusChart } from "./charts/MemberStatusChart";
import { PaymentStatusChart } from "./charts/PaymentStatusChart";
import { ExpenseCategoryChart } from "./charts/ExpenseCategoryChart";
import { FinancialSummary } from "./charts/FinancialSummary";
import { useReport360PdfGeneration } from "@/hooks/reports/useReport360PdfGeneration";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card className="overflow-hidden border border-gray-100 rounded-xl shadow-lg bg-white">
        <CardHeader className="pb-2 px-6 pt-6 flex flex-row items-center justify-between border-b border-gray-100">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-club-500" />
              Relatório 360° - {formatMonthYear(selectedMonth)}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Visão completa do desempenho financeiro e administrativo
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={handleGeneratePdfReport} 
            disabled={generatingPdf}
            className="ml-auto bg-gradient-to-r from-club-500 to-club-600 hover:from-club-600 hover:to-club-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {generatingPdf ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Gerando...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar PDF
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="w-full flex justify-between pt-2 px-4 border-b border-gray-100">
              <TabsTrigger value="summary" className="data-[state=active]:border-b-2 data-[state=active]:border-club-500 data-[state=active]:text-club-600 rounded-none pb-2 px-4 font-medium">
                <Wallet className="h-4 w-4 mr-2" />
                Resumo
              </TabsTrigger>
              <TabsTrigger value="members" className="data-[state=active]:border-b-2 data-[state=active]:border-club-500 data-[state=active]:text-club-600 rounded-none pb-2 px-4 font-medium">
                <Users className="h-4 w-4 mr-2" />
                Sócios
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:border-b-2 data-[state=active]:border-club-500 data-[state=active]:text-club-600 rounded-none pb-2 px-4 font-medium">
                <CreditCard className="h-4 w-4 mr-2" />
                Pagamentos
              </TabsTrigger>
              <TabsTrigger value="expenses" className="data-[state=active]:border-b-2 data-[state=active]:border-club-500 data-[state=active]:text-club-600 rounded-none pb-2 px-4 font-medium">
                <Wallet className="h-4 w-4 mr-2" />
                Despesas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="pt-6 px-6 pb-6 animate-in fade-in-50 duration-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FinancialSummary data={financialSummary} />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="members" className="pt-6 px-6 pb-6 animate-in fade-in-50 duration-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MemberStatusChart data={memberStatusData} />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="payments" className="pt-6 px-6 pb-6 animate-in fade-in-50 duration-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentStatusChart data={paymentStatusData} />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="expenses" className="pt-6 px-6 pb-6 animate-in fade-in-50 duration-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExpenseCategoryChart data={expensesData} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
