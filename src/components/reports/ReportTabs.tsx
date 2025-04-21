import React from "react";
import { BarChart3, FileBarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicReport } from "./BasicReport";
import { Report360View } from "./Report360View";

interface ReportTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedMonth: string;
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
  hideMemberTabs?: boolean;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({
  activeTab,
  onTabChange,
  selectedMonth,
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
  formatMonthYear,
  hideMemberTabs
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mt-6">
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
      
      <TabsContent value="basic">
        {!hideMemberTabs && (
          <BasicReport 
            monthlyRecord={monthlyRecord}
            allMembers={allMembers}
            unpaidMembers={unpaidMembers}
            paidMembers={paidMembers}
            handleGeneratePdfReport={handleGeneratePdfReport}
            generatingPdf={generatingPdf}
            selectedMonth={selectedMonth}
            formatMonthYear={formatMonthYear}
          />
        )}
      </TabsContent>
      
      <TabsContent value="advanced">
        <Report360View 
          loading360={loading360}
          isRetrying360={isRetrying360}
          error360={error360}
          onRetry360={onRetry360}
          memberStatusData={memberStatusData}
          paymentStatusData={paymentStatusData}
          expensesData={expensesData}
          financialSummary={financialSummary}
          selectedMonth={selectedMonth}
          formatMonthYear={formatMonthYear}
        />
      </TabsContent>
    </Tabs>
  );
};
