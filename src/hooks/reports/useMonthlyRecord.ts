import { useState, useEffect, useCallback } from "react";
import { MonthlyRecord } from "@/types";
import { paymentService } from "@/services";
import { useToast } from "@/components/ui/use-toast";

// Default fallback data
const DEFAULT_MONTHLY_RECORD: MonthlyRecord = {
  month: "",
  year: 0,
  totalMembers: 0,
  paidMembers: 0,
  unpaidMembers: 0,
  totalAmount: 0,
  collectedAmount: 0,
};

export const useMonthlyRecord = (selectedMonth: string, selectedYear: string) => {
  const [monthlyRecord, setMonthlyRecord] = useState<MonthlyRecord>(DEFAULT_MONTHLY_RECORD);
  const [loadingMonthlyRecord, setLoadingMonthlyRecord] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMonthlyRecord = useCallback(async () => {
    try {
      setLoadingMonthlyRecord(true);
      setError(null);
      
      // Use a shorter timeout to improve user experience
      const fetchPromise = paymentService.getMonthlyRecord(
        selectedMonth,
        parseInt(selectedYear)
      );
      
      const timeoutPromise = new Promise<MonthlyRecord>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite. O servidor está demorando para responder.")), 5000)
      );
      
      // Race the fetch against a timeout
      const fetchedMonthlyRecord = await Promise.race([fetchPromise, timeoutPromise]);
      setMonthlyRecord(fetchedMonthlyRecord);
    } catch (error) {
      console.error("Error fetching monthly record:", error);
      
      // Set an appropriate error message
      const errorMessage = error instanceof Error
        ? error.message
        : "Erro ao carregar estatísticas mensais. Tente novamente.";
      
      setError(errorMessage);
      
      toast({
        title: "Erro ao carregar estatísticas mensais",
        description: "Algumas informações podem estar indisponíveis no momento.",
        variant: "destructive"
      });
      
      // Keep any previously loaded data to maintain UI continuity
    } finally {
      setLoadingMonthlyRecord(false);
    }
  }, [selectedMonth, selectedYear, toast]);
    
  useEffect(() => {
    fetchMonthlyRecord();
  }, [fetchMonthlyRecord]);

  return { 
    monthlyRecord, 
    loadingMonthlyRecord, 
    error,
    retry: fetchMonthlyRecord 
  };
};
