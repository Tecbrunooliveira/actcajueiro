
import React from "react";
import { motion } from "framer-motion";
import { DashboardStats } from "./DashboardStats";
import { MembersTabView } from "./MembersTabView";

interface BasicReportProps {
  monthlyRecord: any;
  allMembers: any[];
  unpaidMembers: any[];
  paidMembers: any[];
  handleGeneratePdfReport: (type: 'paid' | 'unpaid') => void;
  generatingPdf: boolean;
  selectedMonth: string;
  formatMonthYear: (month: string) => string;
}

export const BasicReport: React.FC<BasicReportProps> = ({
  monthlyRecord,
  allMembers,
  unpaidMembers,
  paidMembers,
  handleGeneratePdfReport,
  generatingPdf,
  selectedMonth,
  formatMonthYear
}) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
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
    </div>
  );
};
