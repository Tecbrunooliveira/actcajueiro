
import { useState, useEffect, useCallback } from "react";
import { MonthlyRecord } from "@/types";
import { paymentService } from "@/services";
import { useToast } from "@/components/ui/use-toast";

export const useMonthlyRecord = (selectedMonth: string, selectedYear: string) => {
  const [monthlyRecord, setMonthlyRecord] = useState<MonthlyRecord>({
    month: "",
    year: 0,
    totalMembers: 0,
    paidMembers: 0,
    unpaidMembers: 0,
    totalAmount: 0,
    collectedAmount: 0,
  });
  const [loadingMonthlyRecord, setLoadingMonthlyRecord] = useState(true);
  const { toast } = useToast();

  const fetchMonthlyRecord = useCallback(async () => {
    try {
      setLoadingMonthlyRecord(true);
      // Add timeout handling to prevent long operations
      const fetchPromise = paymentService.getMonthlyRecord(
        selectedMonth,
        parseInt(selectedYear)
      );
      
      const timeoutPromise = new Promise<MonthlyRecord>((_, reject) => 
        setTimeout(() => reject(new Error("Timeout fetching monthly record")), 8000)
      );
      
      // Race the fetch against a timeout
      const fetchedMonthlyRecord = await Promise.race([fetchPromise, timeoutPromise]);
      setMonthlyRecord(fetchedMonthlyRecord);
    } catch (error) {
      console.error("Error fetching monthly record:", error);
      toast({
        title: "Erro ao carregar estatísticas mensais",
        description: "Algumas informações podem estar incompletas.",
        variant: "destructive"
      });
    } finally {
      setLoadingMonthlyRecord(false);
    }
  }, [selectedMonth, selectedYear, toast]);
    
  useEffect(() => {
    fetchMonthlyRecord();
  }, [fetchMonthlyRecord]);

  return { monthlyRecord, loadingMonthlyRecord };
};
