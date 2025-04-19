
import React, { Suspense } from "react";
import { BarChart3, FileBarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "./LoadingState";
import { motion } from "framer-motion";
import { DashboardStats } from "./DashboardStats";
import { MembersTabView } from "./MembersTabView";

// Lazy load Report360
const Report360 = React.lazy(() => import("./Report360"));

interface ReportTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  loading: boolean;
  dataError: string | null;
  onRetry: () => void;
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
  selectedMonth: string;
  formatMonthYear: (month: string) => string;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({
  activeTab,
  onTabChange,
  loading,
  dataError,
  onRetry,
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
  selectedMonth,
  formatMonthYear
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
            onRetry={onRetry360} 
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
  );
};
