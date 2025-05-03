import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, BanknoteIcon, CoinsIcon, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/services/formatters";
import { motion } from "framer-motion";

export const FinancialSummary = ({ 
  data 
}: { 
  data: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    totalPaymentIncome?: number;
    totalCategoryIncome?: number;
    categoryIncomes?: { name: string; value: number }[];
  } 
}) => {
  const { totalIncome, totalExpenses, balance, totalPaymentIncome = 0, totalCategoryIncome = 0 } = data;
  
  // Add console logging to debug the values
  console.log("FinancialSummary rendering with data:", { totalIncome, totalExpenses, balance });
  
  const isPositiveBalance = balance >= 0;

  const cardVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <motion.div whileHover="hover" variants={cardVariants}>
        <Card className="overflow-hidden rounded-xl border-2 border-green-100 shadow-md hover:shadow-xl transition-all duration-300 relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-green-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center shadow-inner">
              <CoinsIcon className="h-5 w-5 text-club-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Recebimento de sócio</span>
                <span className="font-semibold text-green-700">{formatCurrency(totalPaymentIncome)}</span>
              </div>
              {data.categoryIncomes && data.categoryIncomes.length > 0 && (
                <ul className="ml-2">
                  {data.categoryIncomes.map((cat) => (
                    <li key={cat.name} className="flex justify-between text-[0.85em] py-0.5">
                      <span className="truncate max-w-[120px]">{cat.name}</span>
                      <span className="font-semibold text-green-700">{formatCurrency(cat.value)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center justify-between border-t pt-2 mt-2">
                <span className="text-xs font-bold">Total de receitas</span>
                <span className="text-2xl font-bold text-club-600">{formatCurrency(totalIncome)}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3.5 w-3.5 text-green-500" />
              <span>Receita de pagamentos e lançamentos do período</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div whileHover="hover" variants={cardVariants}>
        <Card className="overflow-hidden rounded-xl border-2 border-red-100 shadow-md hover:shadow-xl transition-all duration-300 relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-400 to-red-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5">
            <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shadow-inner">
              <BanknoteIcon className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500 tracking-tight">{formatCurrency(totalExpenses)}</div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3.5 w-3.5 text-red-500 rotate-180" />
              <span>Valor total gasto no período</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div whileHover="hover" variants={cardVariants}>
        <Card className={`overflow-hidden rounded-xl border-2 ${isPositiveBalance ? 'border-green-100' : 'border-red-100'} shadow-md hover:shadow-xl transition-all duration-300 relative`}>
          <div className={`absolute top-0 left-0 w-full h-1.5 ${
            isPositiveBalance 
              ? 'bg-gradient-to-r from-green-400 to-green-600' 
              : 'bg-gradient-to-r from-red-400 to-red-600'
          }`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5">
            <CardTitle className="text-sm font-medium">Saldo Final</CardTitle>
            <div className={`h-10 w-10 rounded-full ${isPositiveBalance ? 'bg-green-50' : 'bg-red-50'} flex items-center justify-center shadow-inner`}>
              {isPositiveBalance ? (
                <ArrowUpIcon className="h-5 w-5 text-club-500" />
              ) : (
                <ArrowDownIcon className="h-5 w-5 text-red-500" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold tracking-tight ${isPositiveBalance ? 'text-club-600' : 'text-red-500'}`}>
              {formatCurrency(balance)}
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              {isPositiveBalance ? (
                <motion.span 
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                  className="bg-green-100 text-green-800 rounded-full px-2 py-0.5"
                >
                  Positivo no período
                </motion.span>
              ) : (
                <span className="bg-red-100 text-red-800 rounded-full px-2 py-0.5">
                  Negativo no período
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
