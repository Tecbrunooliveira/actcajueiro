
import React, { Suspense } from 'react';
import { LoadingState } from "./LoadingState";

const Report360 = React.lazy(() => import("./Report360"));

interface Report360ViewProps {
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

export const Report360View: React.FC<Report360ViewProps> = ({
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
  if (loading360) {
    return (
      <LoadingState 
        error={error360} 
        onRetry={onRetry360} 
        isRetrying={isRetrying360}
      />
    );
  }

  return (
    <Suspense fallback={
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-club-500 border-t-transparent"></div>
        <p className="mt-4 text-club-600 dark:text-club-300">Carregando relatório...</p>
      </div>
    }>
      <Report360 
        memberStatusData={memberStatusData}
        paymentStatusData={paymentStatusData}
        expensesData={expensesData}
        financialSummary={financialSummary}
        selectedMonth={selectedMonth}
        formatMonthYear={formatMonthYear}
      />
    </Suspense>
  );
};
