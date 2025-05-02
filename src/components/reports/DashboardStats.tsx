
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MonthlyRecord } from "@/types";
import { formatCurrency } from "@/services/formatters";
import { 
  Users,
  CheckCircle,
  DollarSign,
  Wallet,
  BarChart3,
  AlertTriangle,
  PieChart
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStatsProps {
  monthlyRecord: MonthlyRecord;
  allMembers: number;
  unpaidMembersCount: number;
  selectedMonth: string;
  formatMonthYear: (month: string) => string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  monthlyRecord,
  allMembers,
  unpaidMembersCount,
  selectedMonth,
  formatMonthYear
}) => {
  const paymentPercentage = monthlyRecord.totalMembers > 0
    ? Math.round((monthlyRecord.paidMembers / monthlyRecord.totalMembers) * 100)
    : 0;
    
  const collectedPercentage = monthlyRecord.totalAmount > 0
    ? Math.round((monthlyRecord.collectedAmount / monthlyRecord.totalAmount) * 100)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Card className="overflow-hidden border border-gray-100 rounded-xl shadow-lg bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center text-gray-800">
            <PieChart className="h-5 w-5 mr-2 text-club-500" />
            Dashboard {formatMonthYear(selectedMonth)}
          </h3>
          <span className="bg-club-100 text-club-700 px-3 py-1 rounded-full text-xs font-medium">
            Análise Mensal
          </span>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Sócios</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{allMembers}</p>
              </div>
              <div className="bg-club-100 p-2 rounded-full shadow-inner">
                <Users className="h-5 w-5 text-club-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs text-gray-500 font-medium">Pagamentos</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {monthlyRecord.paidMembers}/{monthlyRecord.totalMembers}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-full shadow-inner">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={paymentPercentage} className="h-2" />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">{paymentPercentage}% pagos</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  paymentPercentage > 75 ? 'bg-green-100 text-green-800' : 
                  paymentPercentage > 50 ? 'bg-amber-100 text-amber-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {paymentPercentage > 75 ? 'Ótimo' : 
                   paymentPercentage > 50 ? 'Regular' : 
                   'Baixo'}
                </span>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-medium">Valor Total</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{formatCurrency(monthlyRecord.totalAmount)}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full shadow-inner">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs text-gray-500 font-medium">Recebido</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{formatCurrency(monthlyRecord.collectedAmount)}</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full shadow-inner">
                <Wallet className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={collectedPercentage} className="h-2" />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">{collectedPercentage}% recebidos</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  collectedPercentage > 75 ? 'bg-green-100 text-green-800' : 
                  collectedPercentage > 50 ? 'bg-amber-100 text-amber-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {formatCurrency(monthlyRecord.totalAmount - monthlyRecord.collectedAmount)} pendente
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {unpaidMembersCount > 5 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 flex items-start"
          >
            <div className="bg-white p-2 rounded-full shadow-sm mr-3 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">Atenção Necessária</p>
              <p className="text-xs text-amber-700 mt-1">
                Existem {unpaidMembersCount} sócios inadimplentes este mês. Considere enviar um lembrete para melhorar a taxa de pagamento.
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
