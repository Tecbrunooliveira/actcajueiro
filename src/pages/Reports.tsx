
import React, { useState, useCallback, lazy, Suspense } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";

// Importar hooks e componentes
import { useReportsData } from "@/hooks/useReportsData";
import { useReport360Data } from "@/hooks/useReport360Data";
import { PeriodSelector } from "@/components/reports/PeriodSelector";
import { DashboardStats } from "@/components/reports/DashboardStats";
import { MembersTabView } from "@/components/reports/MembersTabView";
import { LoadingState } from "@/components/reports/LoadingState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { BarChart3, FileBarChart, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// Carregar o componente do relatório de forma preguiçosa para melhorar o tempo de carregamento inicial
const Report360 = lazy(() => import("@/components/reports/Report360").then(module => ({
  default: module.Report360
})));

const Reports = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState('basic');
  
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
    formatMonthYear,
    retry
  } = useReportsData(retryCount);

  // Carregar dados 360° apenas se a aba avançada estiver ativa
  const {
    loading: loading360,
    isRetrying: isRetrying360,
    memberStatusData,
    paymentStatusData,
    expensesData,
    financialSummary,
    error: error360,
    retry: retry360
  } = useReport360Data(
    activeTab === 'advanced' ? selectedMonth : '',
    activeTab === 'advanced' ? selectedYear : ''
  );
  
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    retry && retry();
  }, [retry]);
  
  const handle360Retry = useCallback(() => {
    retry360 && retry360();
  }, [retry360]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState error={dataError} onRetry={handleRetry} />;
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
          <Alert variant="destructive" className="my-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{dataError}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="self-start mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
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
              <LoadingState 
                error={error360} 
                onRetry={handle360Retry} 
                isRetrying={isRetrying360}
              />
            ) : (
              <Suspense fallback={
                <div className="py-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-club-500 border-t-transparent"></div>
                  <p className="mt-4 text-club-600 dark:text-club-300">Carregando relatório...</p>
                </div>
              }>
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
              </Suspense>
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
