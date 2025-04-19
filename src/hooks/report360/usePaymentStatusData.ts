
import { useState, useEffect, useCallback } from "react";
import { paymentService, paymentQueryService } from "@/services";
import { useToast } from "@/components/ui/use-toast";

// Create a more robust cache with longer retention and offline support
const dataCache = new Map<string, {
  data: { name: string; value: number; color: string }[];
  timestamp: number;
  stale: boolean; // Track if data is stale but usable
}>();

// Extend cache expiration to 48 hours for much better offline support
const CACHE_EXPIRATION = 48 * 60 * 60 * 1000;
// Use stale data for up to 14 days if fresh fetch fails
const STALE_EXPIRATION = 14 * 24 * 60 * 60 * 1000;

// Try to persist cache between page reloads
try {
  // Attempt to load cached data from localStorage
  const savedCache = localStorage.getItem('payment-status-cache');
  if (savedCache) {
    const parsedCache = JSON.parse(savedCache);
    Object.entries(parsedCache).forEach(([key, value]) => {
      dataCache.set(key, value as any);
    });
    console.log('Loaded payment status cache from localStorage');
  }
} catch (error) {
  console.error('Failed to load cache from localStorage:', error);
}

// Function to save cache to localStorage
const persistCache = () => {
  try {
    const cacheObject = Object.fromEntries(dataCache.entries());
    localStorage.setItem('payment-status-cache', JSON.stringify(cacheObject));
  } catch (error) {
    console.error('Failed to save cache to localStorage:', error);
  }
};

export const usePaymentStatusData = (selectedMonth: string, selectedYear: string) => {
  const [paymentStatusData, setPaymentStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();
  
  // Create cache key based on month and year
  const cacheKey = `payment-status-${selectedMonth || 'none'}-${selectedYear || 'none'}`;
  
  const fetchPaymentStatusData = useCallback(async (ignoreCache = false) => {
    // Early exit if no month/year selected - use default data
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
        console.log(`Using fresh cached payment status data for ${selectedMonth}-${selectedYear}`);
        setPaymentStatusData(cachedData.data);
        return;
      }
      
      // Use stale cache data while fetching fresh data in background
      if (cachedData && (now - cachedData.timestamp < STALE_EXPIRATION)) {
        console.log(`Using stale cached payment status data for ${selectedMonth}-${selectedYear}`);
        setPaymentStatusData(cachedData.data);
        
        // Mark as stale
        dataCache.set(cacheKey, {
          ...cachedData,
          stale: true
        });
        
        // Persist the updated cache
        persistCache();
      } else if (!cachedData) {
        // Set default data if no cache exists while loading
        setPaymentStatusData([
          { name: 'Em Dia', value: 0, color: '#10b981' },
          { name: 'Inadimplentes', value: 0, color: '#ef4444' }
        ]);
      }
      
      setFetchAttempted(true);
      setIsRetrying(true);
      
      if (ignoreCache) {
        toast({
          title: "Tentando novamente",
          description: "Buscando dados de pagamento...",
        });
      }
      
      // Increase timeout to 20 seconds for more reliable loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      
      try {
        // Enhanced validation for year input
        const yearValue = parseInt(selectedYear);
        if (isNaN(yearValue) || yearValue < 2000 || yearValue > 2100) {
          throw new Error("Ano inválido selecionado");
        }
        
        // First try the new optimized method with retry logic
        const allPayments = await paymentQueryService.getAllPaymentsWithRetry();
        
        // If we got payments, calculate the metrics ourselves instead of making another request
        if (allPayments && allPayments.length > 0) {
          // Filter payments for the selected month/year
          const filteredPayments = allPayments.filter(
            payment => payment.month === selectedMonth && payment.year === yearValue
          );
          
          // Get unique member IDs
          const memberIds = [...new Set(filteredPayments.map(p => p.memberId))];
          
          // Count paid vs unpaid members
          const paidMemberIds = new Set(
            filteredPayments
              .filter(p => p.isPaid)
              .map(p => p.memberId)
          );
          
          const paidMembers = paidMemberIds.size;
          const unpaidMembers = memberIds.length - paidMembers;
          
          clearTimeout(timeoutId);
          
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
          
          // Persist the cache
          persistCache();
          
          setPaymentStatusData(data);
          setIsRetrying(false);
          return;
        }
        
        // Fallback to the original method if the optimized approach didn't return data
        // Use the abort controller for the fetch operation
        const monthlyRecord = await paymentService.getMonthlyRecord(
          selectedMonth,
          yearValue
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
        
        // Persist the cache
        persistCache();
        
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
          setError("Erro de tempo limite ao carregar dados de pagamento. Usando dados em cache quando disponíveis.");
        } else if (error.message.includes("statement timeout")) {
          setError("O servidor está sobrecarregado. Tente novamente mais tarde.");
        } else if (error.message.includes("invalid input")) {
          setError("Erro de formato de dados. Verifique os valores selecionados.");
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
    
    // Check for valid year input
    const yearValue = parseInt(selectedYear);
    if (isNaN(yearValue)) {
      console.error("Invalid year value:", selectedYear);
      setError("Ano inválido selecionado");
      return;
    }
    
    // Add debouncing to avoid multiple rapid API calls
    const debounceTimer = setTimeout(() => {
      fetchPaymentStatusData();
    }, 300);
    
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

