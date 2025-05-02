
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

type ReportHeaderProps = {
  reportTitle: string;
  reportSubtitle: string;
  children?: React.ReactNode;
};

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  reportTitle,
  reportSubtitle,
  children,
}) => (
  <CardHeader className="pb-2 px-6 pt-6 flex flex-row items-center justify-between border-b border-club-100 dark:border-club-800">
    <div>
      <CardTitle className="text-xl font-semibold text-club-800 dark:text-club-100 flex items-center">
        <BarChart2 className="h-5 w-5 mr-2 text-club-600 dark:text-club-300" />
        {reportTitle}
      </CardTitle>
      <p className="text-sm text-club-600 dark:text-club-300 mt-1">
        {reportSubtitle}
      </p>
    </div>
    {children}
  </CardHeader>
);
