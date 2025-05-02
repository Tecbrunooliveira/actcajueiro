
import React from "react";
import { CalendarRange, PlusCircle, SearchCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface PeriodSelectorProps {
  selectedMonth: string;
  selectedYear: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  monthOptions: { value: string; label: string }[];
  yearOptions: string[];
  onGeneratePendingPayments: () => void;
  generatingPayments: boolean;
  onSearch: () => void;
  isSearching: boolean;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  monthOptions,
  yearOptions,
  onGeneratePendingPayments,
  generatingPayments,
  onSearch,
  isSearching,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-club-100 dark:border-club-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-club-900/80 backdrop-blur-sm">
        <div className="gradient-bg px-6 py-4 text-white">
          <div className="flex items-center">
            <CalendarRange className="h-5 w-5 mr-2" />
            <h3 className="font-medium text-lg">Período de Análise</h3>
          </div>
          <p className="text-white/80 text-sm mt-1">Selecione o período e clique em buscar para visualizar os relatórios</p>
        </div>
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label htmlFor="year" className="text-sm font-medium text-club-800 dark:text-club-100 mb-2 block">Ano</Label>
              <Select value={selectedYear} onValueChange={onYearChange}>
                <SelectTrigger 
                  id="year" 
                  className="w-full border-club-200 dark:border-club-700 focus:border-club-500 focus:ring-club-500 rounded-lg bg-white dark:bg-club-800/50 p-3 shadow-sm hover:border-club-400 transition-all"
                >
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-club-100 dark:border-club-800 shadow-lg">
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year} className="hover:bg-club-50 dark:hover:bg-club-800 focus:bg-club-50 cursor-pointer">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="month" className="text-sm font-medium text-club-800 dark:text-club-100 mb-2 block">Mês</Label>
              <Select value={selectedMonth} onValueChange={onMonthChange}>
                <SelectTrigger 
                  id="month" 
                  className="w-full border-club-200 dark:border-club-700 focus:border-club-500 focus:ring-club-500 rounded-lg bg-white dark:bg-club-800/50 p-3 shadow-sm hover:border-club-400 transition-all"
                >
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-club-100 dark:border-club-800 shadow-lg">
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="hover:bg-club-50 dark:hover:bg-club-800 focus:bg-club-50 cursor-pointer">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={onSearch}
              disabled={isSearching}
              className="w-full gradient-bg hover:bg-gradient-to-r hover:from-club-600 hover:via-club-500 hover:to-club-400 rounded-lg font-medium p-4 h-auto shadow-md hover:shadow-lg transition-all"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Buscando...
                </>
              ) : (
                <>
                  <SearchCheck className="mr-2 h-5 w-5" />
                  Buscar Dados
                </>
              )}
            </Button>
            
            <Button
              onClick={onGeneratePendingPayments}
              disabled={generatingPayments}
              variant="outline"
              className="w-full rounded-lg font-medium p-4 h-auto shadow-md hover:shadow-lg transition-all"
            >
              {generatingPayments ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-club-600 border-t-transparent rounded-full" />
                  Gerando...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Gerar Pendentes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
