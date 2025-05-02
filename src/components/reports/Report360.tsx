
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Users, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useReport360PdfGeneration } from "@/hooks/reports/useReport360PdfGeneration";
import { ReportHeader } from "./Report360/ReportHeader";
import { ExportPdfButton } from "./Report360/ExportPdfButton";
import { SummaryTab } from "./Report360/SummaryTab";
import { MembersTab } from "./Report360/MembersTab";
import { PaymentsTab } from "./Report360/PaymentsTab";
import { ExpensesTab } from "./Report360/ExpensesTab";

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

  // Calculate static values outside the render loop to prevent re-renders
  const paidMembersCount = 
    paymentStatusData.find((item) => item.name === "Em Dia")?.value || 0;
  const unpaidMembersCount =
    paymentStatusData.find((item) => item.name === "Inadimplentes")?.value || 0;
  
  // For debugging
  console.log("Report360 rendering with data:", { 
    paymentStatusData,
    paidMembersCount,
    unpaidMembersCount,
    financialSummary
  });

  const getTableTotal = (list: { value: number }[]) =>
    list.reduce((sum, el) => sum + el.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card className="overflow-hidden border border-club-100 dark:border-club-700 rounded-xl shadow-lg bg-white dark:bg-club-900/80 backdrop-blur-sm">
        <ReportHeader
          reportTitle={`Relatório 360° - ${formatMonthYear(selectedMonth)}`}
          reportSubtitle="Visão completa do desempenho financeiro e administrativo"
        >
          <ExportPdfButton
            generatingPdf={generatingPdf}
            handleGeneratePdfReport={handleGeneratePdfReport}
          />
        </ReportHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="w-full flex justify-between pt-2 px-4 border-b border-club-100 dark:border-club-800">
              <TabsTrigger
                value="summary"
                className="data-[state=active]:border-b-2 data-[state=active]:border-club-500 data-[state=active]:text-club-600 dark:data-[state=active]:text-club-300 rounded-none pb-2 px-4 font-medium"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Resumo
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="data-[state=active]:border-b-2 data-[state=active]:border-club-500 data-[state=active]:text-club-600 dark:data-[state=active]:text-club-300 rounded-none pb-2 px-4 font-medium"
              >
                <Users className="h-4 w-4 mr-2" />
                Sócios
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:border-b-2 data-[state=active]:border-club-500 data-[state=active]:text-club-600 dark:data-[state=active]:text-club-300 rounded-none pb-2 px-4 font-medium"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pagamentos
              </TabsTrigger>
              <TabsTrigger
                value="expenses"
                className="data-[state=active]:border-b-2 data-[state=active]:border-club-500 data-[state=active]:text-club-600 dark:data-[state=active]:text-club-300 rounded-none pb-2 px-4 font-medium"
              >
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
                <SummaryTab
                  financialSummary={financialSummary}
                  paidMembersCount={paidMembersCount}
                  unpaidMembersCount={unpaidMembersCount}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="members" className="pt-6 px-6 pb-6 animate-in fade-in-50 duration-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MembersTab
                  memberStatusData={memberStatusData}
                  getTableTotal={getTableTotal}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="payments" className="pt-6 px-6 pb-6 animate-in fade-in-50 duration-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentsTab
                  paymentStatusData={paymentStatusData}
                  getTableTotal={getTableTotal}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="expenses" className="pt-6 px-6 pb-6 animate-in fade-in-50 duration-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExpensesTab
                  expensesData={expensesData}
                  getTableTotal={getTableTotal}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Report360;
