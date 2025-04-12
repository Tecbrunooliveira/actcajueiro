
import React, { useEffect, useState } from "react";
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
import { 
  Users, 
  CreditCard, 
  BarChart3, 
  AlertTriangle, 
  PlusCircle, 
  TrendingUp, 
  ArrowRight,
  DollarSign,
  Activity,
  ChevronRight,
  WalletCards
} from "lucide-react";
import { memberService, paymentService } from "@/services";
import { formatCurrency, getCurrentMonthYear } from "@/services/formatters";
import { MonthlyRecord, Payment } from "@/types";
import { motion } from "framer-motion";

const Index = () => {
  const [members, setMembers] = useState([]);
  const [unpaidPayments, setUnpaidPayments] = useState<Payment[]>([]);
  const [monthlyRecord, setMonthlyRecord] = useState<MonthlyRecord>({
    month: "",
    year: 0,
    totalMembers: 0,
    paidMembers: 0,
    unpaidMembers: 0,
    totalAmount: 0,
    collectedAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const currentMonth = getCurrentMonthYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedMembers = await memberService.getAllMembers();
        const fetchedUnpaidPayments = await paymentService.getUnpaidPayments();
        const fetchedMonthlyRecord = await paymentService.getMonthlyRecord(
          currentMonth.month,
          currentMonth.year
        );

        setMembers(fetchedMembers);
        setUnpaidPayments(fetchedUnpaidPayments);
        setMonthlyRecord(fetchedMonthlyRecord);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <MobileLayout title="ASSOCIAÇÃO ACT - CAJUEIRO">
        <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-club-300 border-t-club-600 rounded-full animate-spin"></div>
          <p className="text-club-700 font-medium">Carregando dados...</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="ASSOCIAÇÃO ACT - CAJUEIRO">
      <motion.div 
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Welcome Card */}
        <motion.div variants={item}>
          <Card className="gradient-bg text-white overflow-hidden rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Bem-vindo à ACT</h2>
                  <p className="text-white/80 text-sm">
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={item}>
          <h2 className="text-lg font-medium mb-2 text-club-800 dark:text-club-100 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-club-600" />
            Resumo
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-club-800/50 backdrop-blur-sm border border-club-100 dark:border-club-700 shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center mb-1">
                  <Users className="h-4 w-4 text-club-600 mr-2" />
                  <p className="text-sm text-club-700 dark:text-club-200 font-medium">Sócios</p>
                </div>
                <p className="text-2xl font-bold text-club-900 dark:text-white">{members.length}</p>
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

        {/* Alerts */}
        {unpaidPayments.length > 0 && (
          <motion.div variants={item}>
            <Card className="border-club-300 bg-club-50 dark:bg-club-800/30 dark:border-club-700 rounded-xl overflow-hidden shadow-md">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-club-100 dark:bg-club-700/50 p-1.5 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-club-600 dark:text-club-300" />
                  </div>
                  <CardTitle className="text-base text-club-700 dark:text-club-100">
                    Pagamentos Pendentes
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm text-club-600 dark:text-club-200">
                  Existem {unpaidPayments.length} pagamentos pendentes.
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link to="/reports" className="text-club-600 dark:text-club-300 text-sm font-medium flex items-center hover:text-club-700 dark:hover:text-club-200 transition-colors">
                  Ver relatório
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div variants={item} className="space-y-4">
          <h2 className="text-lg font-medium text-club-800 dark:text-club-100 flex items-center">
            <PlusCircle className="h-5 w-5 mr-2 text-club-600" />
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/members/new">
              <Button className="w-full gradient-bg hover:bg-gradient-to-r hover:from-club-600 hover:via-club-500 hover:to-club-400 rounded-lg py-3 h-auto">
                <Users className="h-4 w-4 mr-2" />
                Novo Sócio
              </Button>
            </Link>
            <Link to="/payments/new">
              <Button className="w-full gradient-bg hover:bg-gradient-to-r hover:from-club-600 hover:via-club-500 hover:to-club-400 rounded-lg py-3 h-auto">
                <CreditCard className="h-4 w-4 mr-2" />
                Novo Pagamento
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div variants={item} className="space-y-4">
          <h2 className="text-lg font-medium text-club-800 dark:text-club-100 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-club-600" />
            Navegação
          </h2>
          <div className="space-y-3">
            <Link to="/members">
              <Card className="hover:bg-club-50 dark:hover:bg-club-800/50 transition-all duration-200 border border-club-100 dark:border-club-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="bg-club-100 dark:bg-club-700 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-club-600 dark:text-club-200" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-club-800 dark:text-club-100">Sócios</CardTitle>
                    <CardDescription className="text-club-600 dark:text-club-300">
                      Gerenciar cadastro de sócios
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-club-400 dark:text-club-500 ml-auto" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/payments">
              <Card className="hover:bg-club-50 dark:hover:bg-club-800/50 transition-all duration-200 border border-club-100 dark:border-club-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="bg-club-100 dark:bg-club-700 p-2 rounded-lg">
                    <CreditCard className="h-6 w-6 text-club-600 dark:text-club-200" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-club-800 dark:text-club-100">Pagamentos</CardTitle>
                    <CardDescription className="text-club-600 dark:text-club-300">
                      Registrar e consultar pagamentos
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-club-400 dark:text-club-500 ml-auto" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/reports">
              <Card className="hover:bg-club-50 dark:hover:bg-club-800/50 transition-all duration-200 border border-club-100 dark:border-club-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="bg-club-100 dark:bg-club-700 p-2 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-club-600 dark:text-club-200" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-club-800 dark:text-club-100">Relatórios</CardTitle>
                    <CardDescription className="text-club-600 dark:text-club-300">
                      Visualizar relatórios de pagamentos
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-club-400 dark:text-club-500 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </MobileLayout>
  );
};

export default Index;
