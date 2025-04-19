
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useReportsData } from "@/hooks/useReportsData";
import { useReport360Data } from "@/hooks/report360/useReport360Data";
import { PeriodSelector } from "@/components/reports/PeriodSelector";
import { LoadingState } from "@/components/reports/LoadingState";
import { useReportsTab } from "@/hooks/reports/useReportsTab";
import { ReportTabs } from "@/components/reports/ReportTabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, RefreshCw } from "lucide-react";

const Reports = () => {
  const { toast } = useToast();
  const { activeTab, retryCount, handleTabChange, handleRetryCountIncrement } = useReportsTab();
  
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

  // Only load 360° data if the advanced tab is active
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
  
  const handleRetry = () => {
    handleRetryCountIncrement();
    toast({
      title: "Tentando novamente",
      description: "Tentando carregar os dados de relatórios novamente...",
      duration: 3000,
    });
    retry && retry();
  };
  
  const handle360Retry = () => {
    toast({
      title: "Tentando novamente",
      description: "Tentando carregar o relatório 360° novamente...",
      duration: 3000,
    });
    retry360 && retry360();
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

        <ReportTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          loading={loading}
          dataError={dataError}
          onRetry={handleRetry}
          monthlyRecord={monthlyRecord}
          allMembers={allMembers}
          unpaidMembers={unpaidMembers}
          paidMembers={paidMembers}
          handleGeneratePdfReport={handleGeneratePdfReport}
          generatingPdf={generatingPdf}
          loading360={loading360}
          isRetrying360={isRetrying360}
          error360={error360}
          onRetry360={handle360Retry}
          memberStatusData={memberStatusData}
          paymentStatusData={paymentStatusData}
          expensesData={expensesData}
          financialSummary={financialSummary}
          selectedMonth={selectedMonth}
          formatMonthYear={formatMonthYear}
        />
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
