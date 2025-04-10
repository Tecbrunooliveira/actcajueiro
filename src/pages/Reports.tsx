
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

  // Use our new hook for 360 report data
  const {
    loading: loading360,
    memberStatusData,
    paymentStatusData,
    expensesData,
    financialSummary
  } = useReport360Data(selectedMonth, selectedYear);

  if (loading || loading360) {
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

        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Pagamentos</TabsTrigger>
            <TabsTrigger value="advanced">Relatório 360°</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6 pt-4">
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
          </TabsContent>
          
          <TabsContent value="advanced" className="pt-4">
            <Report360 
              memberStatusData={memberStatusData}
              paymentStatusData={paymentStatusData}
              expensesData={expensesData}
              financialSummary={financialSummary}
              selectedMonth={selectedMonth}
              formatMonthYear={formatMonthYear}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Reports;
