
import { useState, useEffect, useCallback } from "react";
import { paymentService } from "@/services";
import { useToast } from "@/components/ui/use-toast";

// Improve cache with a longer retention time
const dataCache = new Map<string, {
  data: { name: string; value: number; color: string }[];
  timestamp: number;
}>();

// Increase cache expiration to 2 hours
const CACHE_EXPIRATION = 2 * 60 * 60 * 1000;

export const usePaymentStatusData = (selectedMonth: string, selectedYear: string) => {
  const [paymentStatusData, setPaymentStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();
  
  // Create cache key based on month and year
  const cacheKey = `payment-status-${selectedMonth}-${selectedYear}`;
  
  const fetchPaymentStatusData = useCallback(async (ignoreCache = false) => {
    // If we don't have month or year selected, return default data
    if (!selectedMonth || !selectedYear) {
      setPaymentStatusData([
        { name: 'Em Dia', value: 0, color: '#10b981' },
        { name: 'Inadimplentes', value: 0, color: '#ef4444' }
      ]);
      return;
    }
    
    try {
      setError(null);
      
      // First check if we have valid cached data
      const cachedData = dataCache.get(cacheKey);
      const now = Date.now();
      
      if (!ignoreCache && cachedData && (now - cachedData.timestamp < CACHE_EXPIRATION)) {
        console.log("Using cached data for payment status");
        setPaymentStatusData(cachedData.data);
        return;
      }
      
      setFetchAttempted(true);
      setIsRetrying(true);
      
      // Show toast when retrying
      if (ignoreCache) {
        toast({
          title: "Tentando novamente",
          description: "Buscando dados de pagamento...",
        });
      }
      
      // Reduce timeout to 3 seconds to improve user experience
      const fetchPromise = paymentService.getMonthlyRecord(
        selectedMonth,
        parseInt(selectedYear)
      );
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar dados de pagamento.")), 3000)
      );
      
      try {
        // Race the fetch against a timeout
        const monthlyRecord = await Promise.race([fetchPromise, timeoutPromise]);
        
        // Add fallback for invalid response
        if (!monthlyRecord || typeof monthlyRecord !== 'object') {
          throw new Error("Dados de pagamento inválidos recebidos do servidor.");
        }
        
        // Ensure we have the expected properties
        const paidMembers = monthlyRecord.paidMembers || 0;
        const unpaidMembers = monthlyRecord.unpaidMembers || 0;
        
        const data = [
          { name: 'Em Dia', value: paidMembers, color: '#10b981' },
          { name: 'Inadimplentes', value: unpaidMembers, color: '#ef4444' }
        ];
        
        // Store data in cache
        dataCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        setPaymentStatusData(data);
      } catch (error) {
        // Handle timeout or other errors
        throw error;
      }
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
    // Cancel previous request if it exists
    const controller = new AbortController();
    
    // Only fetch if we have month and year selected
    if (selectedMonth && selectedYear) {
      fetchPaymentStatusData();
    } else {
      // Set default data if we don't have selection
      setPaymentStatusData([
        { name: 'Em Dia', value: 0, color: '#10b981' },
        { name: 'Inadimplentes', value: 0, color: '#ef4444' }
      ]);
    }
    
    return () => {
      // Clean up request on unmount
      controller.abort();
    };
  }, [fetchPaymentStatusData, selectedMonth, selectedYear]);

  return { 
    paymentStatusData,
    error,
    isRetrying,
    retry
  };
};
