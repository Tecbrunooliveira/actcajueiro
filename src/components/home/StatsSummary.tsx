
import React from 'react';
import { Users, CreditCard, WalletCards, DollarSign } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { formatCurrency } from "@/services/formatters";
import { MonthlyRecord } from "@/types";

interface StatsSummaryProps {
  membersCount: number;
  monthlyRecord: MonthlyRecord;
}

export const StatsSummary = ({ membersCount, monthlyRecord }: StatsSummaryProps) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      <h2 className="text-lg font-medium mb-2 text-club-800 dark:text-club-100 flex items-center">
        <Users className="h-5 w-5 mr-2 text-club-600" />
        Resumo
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white dark:bg-club-800/50 backdrop-blur-sm border border-club-100 dark:border-club-700 shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center mb-1">
              <Users className="h-4 w-4 text-club-600 mr-2" />
              <p className="text-sm text-club-700 dark:text-club-200 font-medium">Sócios</p>
            </div>
            <p className="text-2xl font-bold text-club-900 dark:text-white">{membersCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-club-800/50 backdrop-blur-sm border border-club-100 dark:border-club-700 shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center mb-1">
              <CreditCard className="h-4 w-4 text-club-600 mr-2" />
              <p className="text-sm text-club-700 dark:text-club-200 font-medium">Pagamentos</p>
            </div>
            <p className="text-2xl font-bold text-club-900 dark:text-white">
              {monthlyRecord.paidMembers}/{monthlyRecord.totalMembers}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-club-800/50 backdrop-blur-sm border border-club-100 dark:border-club-700 shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center mb-1">
              <WalletCards className="h-4 w-4 text-club-600 mr-2" />
              <p className="text-sm text-club-700 dark:text-club-200 font-medium">Valor Mensal</p>
            </div>
            <p className="text-xl font-bold text-club-900 dark:text-white">
              {formatCurrency(monthlyRecord.totalAmount)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-club-800/50 backdrop-blur-sm border border-club-100 dark:border-club-700 shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center mb-1">
              <DollarSign className="h-4 w-4 text-club-600 mr-2" />
              <p className="text-sm text-club-700 dark:text-club-200 font-medium">Recebido</p>
            </div>
            <p className="text-xl font-bold text-club-900 dark:text-white">
              {formatCurrency(monthlyRecord.collectedAmount)}
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
