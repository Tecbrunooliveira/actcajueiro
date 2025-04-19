
import React, { useState } from "react";
import { PeriodSelector } from "./PeriodSelector";
import { ErrorAlert } from "./ErrorAlert";
import { ReportTabs } from "./ReportTabs";
import { LoadingState } from "./LoadingState";

interface ReportContentProps {
  loading: boolean;
  dataError: string | null;
  selectedMonth: string;
  selectedYear: string;
  monthOptions: any[];
  yearOptions: string[];
  handleMonthChange: (value: string) => void;
  handleYearChange: (value: string) => void;
  handleGeneratePendingPayments: () => void;
  generatingPayments: boolean;
  handleRetry: () => void;
  activeTab: string;
  handleTabChange: (value: string) => void;
  monthlyRecord: any;
  allMembers: any[];
  unpaidMembers: any[];
  paidMembers: any[];
  handleGeneratePdfReport: (type: 'paid' | 'unpaid') => void;
  generatingPdf: boolean;
  loading360: boolean;
  isRetrying360: boolean;
  error360: string | null;
  onRetry360: () => void;
  memberStatusData: any;
  paymentStatusData: any;
  expensesData: any;
  financialSummary: any;
  formatMonthYear: (month: string) => string;
}

export const ReportContent: React.FC<ReportContentProps> = (props) => {
  const [isSearching, setIsSearching] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  const {
    loading,
    dataError,
    selectedMonth,
    selectedYear,
    monthOptions,
    yearOptions,
    handleMonthChange,
    handleYearChange,
    handleGeneratePendingPayments,
    generatingPayments,
    handleRetry,
    activeTab,
    handleTabChange,
    monthlyRecord,
    allMembers,
    unpaidMembers,
    paidMembers,
    handleGeneratePdfReport,
    generatingPdf,
    loading360,
    isRetrying360,
    error360,
    onRetry360,
    memberStatusData,
    paymentStatusData,
    expensesData,
    financialSummary,
    formatMonthYear
  } = props;

  const handleSearch = () => {
    setIsSearching(true);
    setShowContent(true);
    
    // Simulate loading time for visual feedback
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

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
        onSearch={handleSearch}
        isSearching={isSearching}
      />

      {dataError && (
        <ErrorAlert error={dataError} onRetry={handleRetry} />
      )}

      {showContent && (
        <>
          {loading ? (
            <LoadingState />
          ) : (
            <ReportTabs 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              selectedMonth={selectedMonth}
              monthlyRecord={monthlyRecord}
              allMembers={allMembers}
              unpaidMembers={unpaidMembers}
              paidMembers={paidMembers}
              handleGeneratePdfReport={handleGeneratePdfReport}
              generatingPdf={generatingPdf}
              loading360={loading360}
              isRetrying360={isRetrying360}
              error360={error360}
              onRetry360={onRetry360}
              memberStatusData={memberStatusData}
              paymentStatusData={paymentStatusData}
              expensesData={expensesData}
              financialSummary={financialSummary}
              formatMonthYear={formatMonthYear}
            />
          )}
        </>
      )}
    </div>
  );
};
