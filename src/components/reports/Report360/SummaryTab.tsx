
import React from "react";
import { FinancialSummary } from "../charts/FinancialSummary";
import { MemberStatusCards } from "./MemberStatusCards";

type SummaryTabProps = {
  financialSummary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
  paidMembersCount: number;
  unpaidMembersCount: number;
};

export const SummaryTab: React.FC<SummaryTabProps> = ({
  financialSummary,
  paidMembersCount,
  unpaidMembersCount,
}) => {
  // Add console logs for debugging
  console.log("SummaryTab received values:", { paidMembersCount, unpaidMembersCount });
  
  return (
    <div>
      <FinancialSummary data={financialSummary} />
      <MemberStatusCards
        paidMembersCount={paidMembersCount}
        unpaidMembersCount={unpaidMembersCount}
      />
    </div>
  );
};
