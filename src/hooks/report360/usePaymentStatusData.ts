
import { useState, useEffect, useCallback } from "react";
import { paymentService } from "@/services";
import { useToast } from "@/components/ui/use-toast";

// Add a cache to store previously fetched data
const dataCache = new Map<string, {
  data: { name: string; value: number; color: string }[];
  timestamp: number;
}>();

// Cache expiration time - 5 minutes
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const usePaymentStatusData = (selectedMonth: string, selectedYear: string) => {
  const [paymentStatusData, setPaymentStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();
  
  // Create a cache key based on month and year
  const cacheKey = `payment-status-${selectedMonth}-${selectedYear}`;
  
  const fetchPaymentStatusData = useCallback(async (ignoreCache = false) => {
    try {
      setError(null);
      setFetchAttempted(true);
      
      // First check if we have valid cached data
      const cachedData = dataCache.get(cacheKey);
      const now = Date.now();
      
      if (!ignoreCache && cachedData && (now - cachedData.timestamp < CACHE_EXPIRATION)) {
        console.log("Using cached payment status data");
        setPaymentStatusData(cachedData.data);
        return;
      }
      
      setIsRetrying(true);
      
      // Show toast when retrying
      if (ignoreCache) {
        toast({
          title: "Tentando novamente",
          description: "Buscando dados de pagamento...",
        });
      }
      
      // Use a shorter timeout to improve UX
      const fetchPromise = paymentService.getMonthlyRecord(
        selectedMonth,
        parseInt(selectedYear)
      );
      
      // Increase timeout to 15 seconds
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar dados de pagamento.")), 15000)
      );
      
      // Race the fetch against a timeout
      const monthlyRecord = await Promise.race([fetchPromise, timeoutPromise]);
      
      // Add a fallback in case the response is empty or invalid
      if (!monthlyRecord || typeof monthlyRecord !== 'object') {
        throw new Error("Dados de pagamento inválidos recebidos do servidor.");
      }
      
      // Make sure we have the expected properties
      const paidMembers = monthlyRecord.paidMembers || 0;
      const unpaidMembers = monthlyRecord.unpaidMembers || 0;
      
      const data = [
        { name: 'Em Dia', value: paidMembers, color: '#10b981' },
        { name: 'Inadimplentes', value: unpaidMembers, color: '#ef4444' }
      ];
      
      // Cache the fetched data
      dataCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      setPaymentStatusData(data);
    } catch (error) {
      console.error("Error fetching payment status data:", error);
      
      // Set more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("tempo limite") || error.message.includes("timeout")) {
          setError("Erro de tempo limite ao carregar dados de pagamento.");
        } else {
          setError(error.message);
        }
      } else {
        setError("Erro ao carregar dados de pagamento");
      }
      
      // Use cached data if available, even if expired
      const cachedData = dataCache.get(cacheKey);
      if (cachedData) {
        console.log("Using expired cached data as fallback");
        setPaymentStatusData(cachedData.data);
        
        toast({
          title: "Usando dados em cache",
          description: "Mostrando os últimos dados disponíveis devido a problemas de conexão.",
        });
      } else {
        // Set default data for a better fallback experience
        setPaymentStatusData([
          { name: 'Em Dia', value: 0, color: '#10b981' },
          { name: 'Inadimplentes', value: 0, color: '#ef4444' }
        ]);
      }
    } finally {
      setIsRetrying(false);
    }
  }, [selectedMonth, selectedYear, cacheKey, toast]);

  // Retry function with cache bypass
  const retry = useCallback(() => {
    return fetchPaymentStatusData(true);
  }, [fetchPaymentStatusData]);

  useEffect(() => {
    // Only fetch if we haven't tried yet or if month/year changes
    if (!fetchAttempted || selectedMonth || selectedYear) {
      fetchPaymentStatusData();
    }
  }, [fetchPaymentStatusData, fetchAttempted, selectedMonth, selectedYear]);

  return { 
    paymentStatusData,
    error,
    isRetrying,
    retry
  };
};
