
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, BarChart2, Users, CreditCard, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialSummary } from "./charts/FinancialSummary";
import { useReport360PdfGeneration } from "@/hooks/reports/useReport360PdfGeneration";
import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

export const Report360 = ({
  memberStatusData,
  paymentStatusData,
  expensesData,
  financialSummary,
  selectedMonth,
  formatMonthYear,
}: {
  memberStatusData: { name: string; value: number; color: string }[];
  paymentStatusData: { name: string; value: number; color: string }[];
  expensesData: { name: string; value: number; color: string }[];
  financialSummary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
  selectedMonth: string;
  formatMonthYear: (month: string) => string;
}) => {
  const { generatingPdf, handleGeneratePdfReport } = useReport360PdfGeneration(
    selectedMonth,
    memberStatusData,
    paymentStatusData,
    expensesData,
    financialSummary
  );

  const getTableTotal = (list: { value: number }[]) =>
    list.reduce((sum, el) => sum + el.value, 0);
    
  // Extract the "paid members" count from the paymentStatusData
  const paidMembersCount = paymentStatusData.find(item => item.name === 'Em Dia')?.value || 0;
  const unpaidMembersCount = paymentStatusData.find(item => item.name === 'Inadimplentes')?.value || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card className="overflow-hidden border border-club-100 dark:border-club-700 rounded-xl shadow-lg bg-white dark:bg-club-900/80 backdrop-blur-sm">
        <CardHeader className="pb-2 px-6 pt-6 flex flex-row items-center justify-between border-b border-club-100 dark:border-club-800">
          <div>
            <CardTitle className="text-xl font-semibold text-club-800 dark:text-club-100 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-club-600 dark:text-club-300" />
              Relatório 360° - {formatMonthYear(selectedMonth)}
            </CardTitle>
            <p className="text-sm text-club-600 dark:text-club-300 mt-1">
              Visão completa do desempenho financeiro e administrativo
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={handleGeneratePdfReport} 
            disabled={generatingPdf}
            className="ml-auto gradient-bg hover:bg-gradient-to-r hover:from-club-600 hover:via-club-500 hover:to-club-400 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {generatingPdf ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Gerando...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar PDF
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="w-full flex justify-between pt-2 px-4 border-b border-club-100 dark:border-club-800">
              <TabsTrigger 
                value="summary" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-club-500 data-[state=active]:text-club-600 dark:data-[state=active]:text-club-300 rounded-none pb-2 px-4 font-medium"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Resumo
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-club-500 data-[state=active]:text-club-600 dark:data-[state=active]:text-club-300 rounded-none pb-2 px-4 font-medium"
              >
                <Users className="h-4 w-4 mr-2" />
                Sócios
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-club-500 data-[state=active]:text-club-600 dark:data-[state=active]:text-club-300 rounded-none pb-2 px-4 font-medium"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pagamentos
              </TabsTrigger>
              <TabsTrigger 
                value="expenses" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-club-500 data-[state=active]:text-club-600 dark:data-[state=active]:text-club-300 rounded-none pb-2 px-4 font-medium"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Despesas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="pt-6 px-6 pb-6 animate-in fade-in-50 duration-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FinancialSummary data={financialSummary} />
                
                {/* Added a simple payment status summary for quick reference */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Sócios em Dia</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{paidMembersCount}</p>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Sócios Inadimplentes</h3>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{unpaidMembersCount}</p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="members" className="pt-6 px-6 pb-6 animate-in fade-in-50 duration-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-lg mx-auto">
                  <h3 className="text-md font-semibold mb-4">Detalhes por Status</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Percentual</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memberStatusData.map((item, idx, arr) => {
                        const total = getTableTotal(arr);
                        return (
                          <TableRow key={item.name}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">{item.value}</TableCell>
                            <TableCell className="text-right">
                              {total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "0%"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow className="font-medium">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                          {getTableTotal(memberStatusData)}
                        </TableCell>
                        <TableCell className="text-right">100%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="payments" className="pt-6 px-6 pb-6 animate-in fade-in-50 duration-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-lg mx-auto">
                  <h3 className="text-md font-semibold mb-4">Detalhes de Pagamento</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Percentual</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentStatusData.map((item, idx, arr) => {
                        const total = getTableTotal(arr);
                        return (
                          <TableRow key={item.name}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">{item.value}</TableCell>
                            <TableCell className="text-right">
                              {total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "0%"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow className="font-medium">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                          {getTableTotal(paymentStatusData)}
                        </TableCell>
                        <TableCell className="text-right">100%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="expenses" className="pt-6 px-6 pb-6 animate-in fade-in-50 duration-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-lg mx-auto">
                  <h3 className="text-md font-semibold mb-4">Despesas por Categoria</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Percentual</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expensesData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center italic py-4">
                            Nenhuma despesa registrada para este período
                          </TableCell>
                        </TableRow>
                      ) : (
                        expensesData.map((item, idx, arr) => {
                          const total = getTableTotal(arr);
                          return (
                            <TableRow key={item.name}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-right">
                                {item.value.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </TableCell>
                              <TableCell className="text-right">
                                {total > 0
                                  ? `${((item.value / total) * 100).toFixed(1)}%`
                                  : "0%"}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                      {expensesData.length > 0 && (
                        <TableRow className="font-medium">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">
                            {getTableTotal(expensesData).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                          <TableCell className="text-right">100%</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Report360;
