
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";

// Import our hooks and components
import { useReportsData } from "@/hooks/useReportsData";
import { useReport360Data } from "@/hooks/useReport360Data";
import { PeriodSelector } from "@/components/reports/PeriodSelector";
import { DashboardStats } from "@/components/reports/DashboardStats";
import { MembersTabView } from "@/components/reports/MembersTabView";
import { Report360 } from "@/components/reports/Report360";
import { LoadingState } from "@/components/reports/LoadingState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { BarChart3, FileBarChart, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Reports = () => {
  const {
    selectedMonth,
    selectedYear,
    monthOptions,
    yearOptions,
    monthlyRecord,
    allMembers,
    unpaidMembers,
    paidMembers,
    loading,
    dataError,
    generatingPayments,
    generatingPdf,
    handleMonthChange,
    handleYearChange,
    handleGeneratePendingPayments,
    handleGeneratePdfReport,
    formatMonthYear
  } = useReportsData();

  // Use our new hook for 360 report data
  const {
    loading: loading360,
    memberStatusData,
    paymentStatusData,
    expensesData,
    financialSummary
  } = useReport360Data(selectedMonth, selectedYear);

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    return (
      <div className="space-y-6 animate-fade-in pb-12">
        <PeriodSelector 
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          monthOptions={monthOptions}
          yearOptions={yearOptions}
          onGeneratePendingPayments={handleGeneratePendingPayments}
          generatingPayments={generatingPayments}
        />

        {dataError && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {dataError}. Tente alterar o período ou recarregar a página.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="basic" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 rounded-xl p-1 bg-muted border border-club-100 dark:border-club-700 shadow-md">
            <TabsTrigger 
              value="basic" 
              className="rounded-lg py-2.5 font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-club-800 data-[state=active]:text-club-600 dark:data-[state=active]:text-club-300 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Pagamentos
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="rounded-lg py-2.5 font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-club-800 data-[state=active]:text-club-600 dark:data-[state=active]:text-club-300 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <FileBarChart className="h-4 w-4 mr-2" />
              Relatório 360°
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6 pt-6 animate-in fade-in-50 duration-300">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardStats 
                monthlyRecord={monthlyRecord}
                allMembers={allMembers.length}
                unpaidMembersCount={unpaidMembers.length}
                selectedMonth={selectedMonth}
                formatMonthYear={formatMonthYear}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <MembersTabView 
                paidMembers={paidMembers}
                unpaidMembers={unpaidMembers}
                handleGeneratePdfReport={handleGeneratePdfReport}
                generatingPdf={generatingPdf}
              />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="advanced" className="pt-6 animate-in fade-in-50 duration-300">
            {loading360 ? (
              <LoadingState />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Report360 
                  memberStatusData={memberStatusData}
                  paymentStatusData={paymentStatusData}
                  expensesData={expensesData}
                  financialSummary={financialSummary}
                  selectedMonth={selectedMonth}
                  formatMonthYear={formatMonthYear}
                />
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <MobileLayout title="Relatórios">
      {renderContent()}
    </MobileLayout>
  );
};

export default Reports;
