
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, CreditCard, BarChart3, AlertTriangle } from "lucide-react";
import { memberService, paymentService, formatCurrency, getCurrentMonthYear } from "@/services/dataService";

const Index = () => {
  const members = memberService.getAllMembers();
  const currentMonth = getCurrentMonthYear();
  const unpaidPayments = paymentService.getUnpaidPayments();
  const monthlyRecord = paymentService.getMonthlyRecord(
    currentMonth.month,
    currentMonth.year
  );

  return (
    <MobileLayout title="Mensal Cash Flow">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">Sócios</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-bold">{members.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">Pagamentos</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-bold">
                {monthlyRecord.paidMembers}/{monthlyRecord.totalMembers}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">Valor Mensal</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xl font-bold">
                {formatCurrency(monthlyRecord.totalAmount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">Recebido</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xl font-bold">
                {formatCurrency(monthlyRecord.collectedAmount)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {unpaidPayments.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-base text-red-700">
                  Pagamentos Pendentes
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-red-600">
                Existem {unpaidPayments.length} pagamentos pendentes.
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link to="/reports" className="text-red-600 text-sm font-medium">
                Ver relatório →
              </Link>
            </CardFooter>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/members/new">
              <Button className="w-full bg-club-500 hover:bg-club-600">
                Novo Sócio
              </Button>
            </Link>
            <Link to="/payments/new">
              <Button className="w-full bg-club-500 hover:bg-club-600">
                Novo Pagamento
              </Button>
            </Link>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Navegação</h2>
          <div className="space-y-3">
            <Link to="/members">
              <Card className="hover:bg-gray-50 transition">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="bg-club-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-club-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Sócios</CardTitle>
                    <CardDescription>
                      Gerenciar cadastro de sócios
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/payments">
              <Card className="hover:bg-gray-50 transition">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="bg-club-100 p-2 rounded-lg">
                    <CreditCard className="h-6 w-6 text-club-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Pagamentos</CardTitle>
                    <CardDescription>
                      Registrar e consultar pagamentos
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/reports">
              <Card className="hover:bg-gray-50 transition">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="bg-club-100 p-2 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-club-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Relatórios</CardTitle>
                    <CardDescription>
                      Visualizar relatórios de pagamentos
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Index;
