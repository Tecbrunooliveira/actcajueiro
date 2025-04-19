
import React from "react";
import { PeriodSelector } from "./PeriodSelector";
import { ErrorAlert } from "./ErrorAlert";
import { ReportTabs } from "./ReportTabs";

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
    ...tabsProps
  } = props;

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
        <ErrorAlert error={dataError} onRetry={handleRetry} />
      )}

      <ReportTabs {...tabsProps} />
    </div>
  );
};
