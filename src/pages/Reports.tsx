
import React, { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useReportsData } from "@/hooks/useReportsData";
import { useReport360Data } from "@/hooks/report360/useReport360Data";
import { LoadingState } from "@/components/reports/LoadingState";
import { useReportsTab } from "@/hooks/reports/useReportsTab";
import { useToast } from "@/hooks/use-toast";
import { ReportContent } from "@/components/reports/ReportContent";

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
    handleRetry: handleReportsDataRetry
  } = useReportsData(retryCount);

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
    activeTab === 'advanced' && retryCount > 0 ? selectedMonth : '',
    activeTab === 'advanced' && retryCount > 0 ? selectedYear : ''
  );
  
  // Combined retry function
  const handleRetry = () => {
    handleRetryCountIncrement();
    toast({
      title: "Tentando novamente",
      description: "Tentando carregar os dados de relatórios novamente...",
      duration: 3000,
    });
    if (handleReportsDataRetry) {
      handleReportsDataRetry();
    }
  };
  
  const handle360Retry = () => {
    toast({
      title: "Tentando novamente",
      description: "Tentando carregar o relatório 360° novamente...",
      duration: 3000,
    });
    if (retry360) {
      retry360();
    }
  };

  // Only show main loading state on initial load, not when waiting for search results
  const isInitialLoading = loading && retryCount === 0;

  if (isInitialLoading) {
    return (
      <MobileLayout title="Relatórios">
        <LoadingState error={dataError} onRetry={handleRetry} />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Relatórios">
      <ReportContent
        loading={loading}
        dataError={dataError}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        monthOptions={monthOptions}
        yearOptions={yearOptions}
        handleMonthChange={handleMonthChange}
        handleYearChange={handleYearChange}
        handleGeneratePendingPayments={handleGeneratePendingPayments}
        generatingPayments={generatingPayments}
        handleRetry={handleRetry}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
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
        formatMonthYear={formatMonthYear}
      />
    </MobileLayout>
  );
};

export default Reports;
