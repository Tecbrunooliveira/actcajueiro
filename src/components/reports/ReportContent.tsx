
import React, { useState, useEffect } from "react";
import { PeriodSelector } from "./PeriodSelector";
import { ErrorAlert } from "./ErrorAlert";
import { ReportTabs } from "./ReportTabs";
import { LoadingState } from "./LoadingState";
import { useAuth } from "@/contexts/auth";

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
  const [firstLoad, setFirstLoad] = useState(true);
  const { isAdmin } = useAuth();
  
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

  // Handle search button click - triggers data loading
  const handleSearch = () => {
    setIsSearching(true);
    setShowContent(true);
    setFirstLoad(false);
    
    // Initiate data refresh
    handleRetry();
    
    // Provide visual feedback during loading
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  // Show appropriate content based on search status
  useEffect(() => {
    if (!firstLoad && !loading && !isSearching) {
      setShowContent(true);
    }
  }, [loading, isSearching, firstLoad]);

  // For non-admins, always force activeTab to "advanced"
  useEffect(() => {
    if (!isAdmin && activeTab !== "advanced") {
      handleTabChange("advanced");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, activeTab, handleTabChange]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Only provide the generate payments function for admins */}
      <PeriodSelector 
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        monthOptions={monthOptions}
        yearOptions={yearOptions}
        onGeneratePendingPayments={isAdmin ? handleGeneratePendingPayments : undefined}
        generatingPayments={isAdmin ? generatingPayments : false}
        onSearch={handleSearch}
        isSearching={isSearching || loading}
      />

      {dataError && (
        <ErrorAlert error={dataError} onRetry={handleRetry} />
      )}

      {showContent && (
        <>
          {(loading || isSearching) ? (
            <LoadingState />
          ) : (
            <ReportTabs 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              selectedMonth={selectedMonth}
              monthlyRecord={monthlyRecord}
              allMembers={isAdmin ? allMembers : []}
              unpaidMembers={isAdmin ? unpaidMembers : []}
              paidMembers={isAdmin ? paidMembers : []}
              handleGeneratePdfReport={isAdmin ? handleGeneratePdfReport : () => {}}
              generatingPdf={isAdmin ? generatingPdf : false}
              loading360={loading360}
              isRetrying360={isRetrying360}
              error360={error360}
              onRetry360={onRetry360}
              memberStatusData={memberStatusData}
              paymentStatusData={paymentStatusData}
              expensesData={expensesData}
              financialSummary={financialSummary}
              formatMonthYear={formatMonthYear}
              hideMemberTabs={!isAdmin}
              isAdmin={isAdmin}
            />
          )}
        </>
      )}
    </div>
  );
};

