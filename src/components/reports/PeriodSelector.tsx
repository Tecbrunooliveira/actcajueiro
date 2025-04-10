
import React from "react";
import { CalendarRange } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PeriodSelectorProps {
  selectedMonth: string;
  selectedYear: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  monthOptions: { value: string; label: string }[];
  yearOptions: string[];
  onGeneratePendingPayments: () => void;
  generatingPayments: boolean;
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
}) => {
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className="bg-club-500 px-4 py-3 text-white">
        <div className="flex items-center">
          <CalendarRange className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Período</h3>
        </div>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year" className="text-sm text-muted-foreground mb-1.5 block">Ano</Label>
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger id="year" className="w-full border-gray-200 focus:border-club-400 focus:ring-club-400">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="month" className="text-sm text-muted-foreground mb-1.5 block">Mês</Label>
            <Select value={selectedMonth} onValueChange={onMonthChange}>
              <SelectTrigger id="month" className="w-full border-gray-200 focus:border-club-400 focus:ring-club-400">
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          onClick={onGeneratePendingPayments}
          disabled={generatingPayments}
          className="w-full bg-club-500 hover:bg-club-600 transition-all"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {generatingPayments 
            ? "Gerando pagamentos..." 
            : "Gerar Pagamentos Pendentes"}
        </Button>
      </CardContent>
    </Card>
  );
};
