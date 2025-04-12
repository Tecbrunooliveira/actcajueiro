
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, BanknoteIcon, CoinsIcon } from "lucide-react";
import { formatCurrency } from "@/services/formatters";

export const FinancialSummary = ({ 
  data 
}: { 
  data: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  } 
}) => {
  const { totalIncome, totalExpenses, balance } = data;
  const isPositiveBalance = balance >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="overflow-hidden border-2 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
            <CoinsIcon className="h-4 w-4 text-club-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-club-600">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Valor total recebido dos sócios
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border-2 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
          <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
            <BanknoteIcon className="h-4 w-4 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Valor total gasto no período
          </p>
        </CardContent>
      </Card>
      
      <Card className={`overflow-hidden border-2 ${isPositiveBalance ? 'border-green-100' : 'border-red-100'} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${
          isPositiveBalance 
            ? 'bg-gradient-to-r from-green-400 to-green-600' 
            : 'bg-gradient-to-r from-red-400 to-red-600'
        }`} />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          <div className={`h-8 w-8 rounded-full ${isPositiveBalance ? 'bg-green-50' : 'bg-red-50'} flex items-center justify-center`}>
            {isPositiveBalance ? (
              <ArrowUpIcon className="h-4 w-4 text-club-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositiveBalance ? 'text-club-600' : 'text-red-500'}`}>
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isPositiveBalance ? 'Positivo' : 'Negativo'} no período
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
