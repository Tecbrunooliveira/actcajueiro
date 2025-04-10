
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
  AlertTriangle
} from "lucide-react";

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

  return (
    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-club-500" />
          Dashboard {formatMonthYear(selectedMonth)}
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">Total Sócios</p>
                <p className="text-2xl font-bold">{allMembers}</p>
              </div>
              <div className="bg-club-100 p-2 rounded-full">
                <Users className="h-4 w-4 text-club-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">Pagamentos</p>
                <p className="text-2xl font-bold">
                  {monthlyRecord.paidMembers}/{monthlyRecord.totalMembers}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={paymentPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{paymentPercentage}% pagos</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">Valor Total</p>
                <p className="text-xl font-bold">{formatCurrency(monthlyRecord.totalAmount)}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">Recebido</p>
                <p className="text-xl font-bold">{formatCurrency(monthlyRecord.collectedAmount)}</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Wallet className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={collectedPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{collectedPercentage}% recebidos</p>
            </div>
          </div>
        </div>
        
        {unpaidMembersCount > 5 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Atenção</p>
              <p className="text-xs text-amber-700">
                Existem {unpaidMembersCount} sócios inadimplentes este mês. Considere enviar um lembrete.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
