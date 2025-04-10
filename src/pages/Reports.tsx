
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";

// Import our new hook and components
import { useReportsData } from "@/hooks/useReportsData";
import { PeriodSelector } from "@/components/reports/PeriodSelector";
import { DashboardStats } from "@/components/reports/DashboardStats";
import { MembersTabView } from "@/components/reports/MembersTabView";
import { LoadingState } from "@/components/reports/LoadingState";

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
    generatingPayments,
    generatingPdf,
    handleMonthChange,
    handleYearChange,
    handleGeneratePendingPayments,
    handleGeneratePdfReport,
    formatMonthYear
  } = useReportsData();

  if (loading) {
    return (
      <MobileLayout title="Relatórios">
        <LoadingState />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Relatórios">
      <div className="space-y-6">
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

        <DashboardStats 
          monthlyRecord={monthlyRecord}
          allMembers={allMembers.length}
          unpaidMembersCount={unpaidMembers.length}
          selectedMonth={selectedMonth}
          formatMonthYear={formatMonthYear}
        />
        
        <MembersTabView 
          paidMembers={paidMembers}
          unpaidMembers={unpaidMembers}
          handleGeneratePdfReport={handleGeneratePdfReport}
          generatingPdf={generatingPdf}
        />
      </div>
    </MobileLayout>
  );
};

export default Reports;
