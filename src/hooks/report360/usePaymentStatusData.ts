
import { useState, useCallback } from "react";
import { paymentQueryService } from "@/services/payment";
import { paymentStatusCache, CACHE_EXPIRATION } from "@/services/cache/paymentStatusCache";
import { paymentMetricsService } from "@/services/payment/paymentMetricsService";
import { useToast } from "@/components/ui/use-toast";

export const usePaymentStatusData = (selectedMonth: string, selectedYear: string) => {
  const [paymentStatusData, setPaymentStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();
  
  const cacheKey = `payment-status-${selectedMonth || 'none'}-${selectedYear || 'none'}`;
  
  const fetchPaymentStatusData = useCallback(async (ignoreCache = false) => {
    if (!selectedMonth || !selectedYear) {
      setPaymentStatusData([
        { name: 'Em Dia', value: 0, color: '#10b981' },
        { name: 'Inadimplentes', value: 0, color: '#ef4444' }
      ]);
      return;
    }
    
    try {
      setError(null);
      
      // Check cache
      const cachedData = paymentStatusCache.get(cacheKey);
      
      // Use fresh cache if available and not explicitly bypassing
      if (!ignoreCache && paymentStatusCache.isValidCache(cachedData)) {
        console.log(`Using fresh cached payment status data for ${selectedMonth}-${selectedYear}`);
        setPaymentStatusData(cachedData.data);
        return;
      }
      
      // Use stale cache data while fetching fresh data
      if (paymentStatusCache.isStaleButUsable(cachedData)) {
        console.log(`Using stale cached payment status data for ${selectedMonth}-${selectedYear}`);
        setPaymentStatusData(cachedData.data);
      } else {
        // Set default data if no cache exists
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
      
      // Enhanced validation for year input
      const yearValue = parseInt(selectedYear);
      if (isNaN(yearValue) || yearValue < 2000 || yearValue > 2100) {
        throw new Error("Ano inválido selecionado");
      }
      
      const allPayments = await paymentQueryService.getAllPaymentsWithRetry();
      
      if (allPayments && allPayments.length > 0) {
        // Filter payments for the selected month/year
        const filteredPayments = allPayments.filter(
          payment => payment.month === selectedMonth && payment.year === yearValue
        );
        
        const data = paymentMetricsService.calculatePaymentStatusMetrics(filteredPayments);
        
        // Store data in cache
        paymentStatusCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          stale: false
        });
        
        setPaymentStatusData(data);
        setIsRetrying(false);
      }
      
    } catch (error) {
      console.error("Error fetching payment status data:", error);
      
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
      
      // Use ANY cached data if available
      const cachedData = paymentStatusCache.get(cacheKey);
      if (cachedData) {
        console.log("Using cached data as fallback due to error");
        setPaymentStatusData(cachedData.data);
        
        toast({
          title: "Usando dados em cache",
          description: "Mostrando os últimos dados disponíveis devido a problemas de conexão.",
          duration: 5000,
        });
      }
    } finally {
      setIsRetrying(false);
    }
  }, [selectedMonth, selectedYear, cacheKey, toast]);

  // Return values
  return { 
    paymentStatusData,
    error,
    isRetrying,
    retry: useCallback(() => fetchPaymentStatusData(true), [fetchPaymentStatusData])
  };
};
