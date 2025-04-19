
import { useState, useEffect, useCallback } from "react";
import { paymentService } from "@/services";
import { useToast } from "@/components/ui/use-toast";

// Create a more robust cache with longer retention
const dataCache = new Map<string, {
  data: { name: string; value: number; color: string }[];
  timestamp: number;
  stale: boolean; // Track if data is stale but usable
}>();

// Increase cache expiration to 4 hours to reduce API calls
const CACHE_EXPIRATION = 4 * 60 * 60 * 1000;
// Use stale data for up to 24 hours if fresh fetch fails
const STALE_EXPIRATION = 24 * 60 * 60 * 1000;

export const usePaymentStatusData = (selectedMonth: string, selectedYear: string) => {
  const [paymentStatusData, setPaymentStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();
  
  // Create cache key based on month and year
  const cacheKey = `payment-status-${selectedMonth}-${selectedYear}`;
  
  const fetchPaymentStatusData = useCallback(async (ignoreCache = false) => {
    // Early exit if no month/year selected
    if (!selectedMonth || !selectedYear) {
      setPaymentStatusData([
        { name: 'Em Dia', value: 0, color: '#10b981' },
        { name: 'Inadimplentes', value: 0, color: '#ef4444' }
      ]);
      return;
    }
    
    try {
      setError(null);
      
      // Check if we have valid cached data
      const cachedData = dataCache.get(cacheKey);
      const now = Date.now();
      
      // Use fresh cache if available and not explicitly bypassing
      if (!ignoreCache && cachedData && (now - cachedData.timestamp < CACHE_EXPIRATION)) {
        console.log("Using fresh cached payment status data");
        setPaymentStatusData(cachedData.data);
        return;
      }
      
      // Use stale cache data while fetching fresh data in background
      if (cachedData && (now - cachedData.timestamp < STALE_EXPIRATION)) {
        console.log("Using stale cached payment status data while refreshing");
        setPaymentStatusData(cachedData.data);
        // Mark as stale
        dataCache.set(cacheKey, {
          ...cachedData,
          stale: true
        });
      }
      
      setFetchAttempted(true);
      setIsRetrying(true);
      
      if (ignoreCache) {
        toast({
          title: "Tentando novamente",
          description: "Buscando dados de pagamento...",
        });
      }
      
      // Increase timeout to 10 seconds for more reliable loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        // Use the abort controller for the fetch operation
        const monthlyRecord = await paymentService.getMonthlyRecord(
          selectedMonth,
          parseInt(selectedYear)
        );
        
        clearTimeout(timeoutId);
        
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
          timestamp: Date.now(),
          stale: false
        });
        
        setPaymentStatusData(data);
      } catch (error) {
        clearTimeout(timeoutId);
        
        // Handle timeout or other errors
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new Error("Erro de tempo limite ao carregar dados de pagamento.");
        }
        throw error;
      }
    } catch (error) {
      console.error("Error fetching payment status data:", error);
      
      // Set more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("tempo limite") || error.message.includes("timeout")) {
          setError("Erro de tempo limite ao carregar dados de pagamento.");
        } else if (error.message.includes("statement timeout")) {
          setError("O servidor está sobrecarregado. Tente novamente mais tarde.");
        } else {
          setError(error.message);
        }
      } else {
        setError("Erro ao carregar dados de pagamento");
      }
      
      // Use ANY cached data if available, even if stale
      const cachedData = dataCache.get(cacheKey);
      if (cachedData) {
        console.log("Using cached data as fallback due to error");
        setPaymentStatusData(cachedData.data);
        
        toast({
          title: "Usando dados em cache",
          description: "Mostrando os últimos dados disponíveis devido a problemas de conexão.",
          duration: 5000,
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
    // Skip fetch if no selection
    if (!selectedMonth || !selectedYear) {
      setPaymentStatusData([
        { name: 'Em Dia', value: 0, color: '#10b981' },
        { name: 'Inadimplentes', value: 0, color: '#ef4444' }
      ]);
      return;
    }
    
    // Add debouncing to avoid multiple rapid API calls
    const debounceTimer = setTimeout(() => {
      fetchPaymentStatusData();
    }, 200);
    
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [fetchPaymentStatusData, selectedMonth, selectedYear]);

  return { 
    paymentStatusData,
    error,
    isRetrying,
    retry
  };
};
