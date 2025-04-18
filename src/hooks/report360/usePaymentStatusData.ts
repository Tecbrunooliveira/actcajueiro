
import { useState, useEffect, useCallback } from "react";
import { paymentService } from "@/services";
import { useToast } from "@/components/ui/use-toast";

// Melhorar cache para armazenar dados previamente carregados
const dataCache = new Map<string, {
  data: { name: string; value: number; color: string }[];
  timestamp: number;
}>();

// Aumentar tempo de expiração para 30 minutos para reduzir chamadas à API
const CACHE_EXPIRATION = 30 * 60 * 1000;

export const usePaymentStatusData = (selectedMonth: string, selectedYear: string) => {
  const [paymentStatusData, setPaymentStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();
  
  // Criar chave de cache baseada no mês e ano
  const cacheKey = `payment-status-${selectedMonth}-${selectedYear}`;
  
  const fetchPaymentStatusData = useCallback(async (ignoreCache = false) => {
    // Se não temos mês ou ano selecionados, retornar dados padrão
    if (!selectedMonth || !selectedYear) {
      setPaymentStatusData([
        { name: 'Em Dia', value: 0, color: '#10b981' },
        { name: 'Inadimplentes', value: 0, color: '#ef4444' }
      ]);
      return;
    }
    
    try {
      setError(null);
      
      // Primeiro verificar se temos dados em cache válidos
      const cachedData = dataCache.get(cacheKey);
      const now = Date.now();
      
      if (!ignoreCache && cachedData && (now - cachedData.timestamp < CACHE_EXPIRATION)) {
        console.log("Usando dados em cache para status de pagamento");
        setPaymentStatusData(cachedData.data);
        return;
      }
      
      setFetchAttempted(true);
      setIsRetrying(true);
      
      // Mostrar toast ao tentar novamente
      if (ignoreCache) {
        toast({
          title: "Tentando novamente",
          description: "Buscando dados de pagamento...",
        });
      }
      
      // Reduzir timeout para 6 segundos para melhorar a experiência do usuário
      const fetchPromise = paymentService.getMonthlyRecord(
        selectedMonth,
        parseInt(selectedYear)
      );
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar dados de pagamento.")), 6000)
      );
      
      // Competir a busca contra um timeout
      const monthlyRecord = await Promise.race([fetchPromise, timeoutPromise]);
      
      // Adicionar fallback caso a resposta seja vazia ou inválida
      if (!monthlyRecord || typeof monthlyRecord !== 'object') {
        throw new Error("Dados de pagamento inválidos recebidos do servidor.");
      }
      
      // Garantir que temos as propriedades esperadas
      const paidMembers = monthlyRecord.paidMembers || 0;
      const unpaidMembers = monthlyRecord.unpaidMembers || 0;
      
      const data = [
        { name: 'Em Dia', value: paidMembers, color: '#10b981' },
        { name: 'Inadimplentes', value: unpaidMembers, color: '#ef4444' }
      ];
      
      // Armazenar os dados em cache
      dataCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      setPaymentStatusData(data);
    } catch (error) {
      console.error("Error fetching payment status data:", error);
      
      // Definir mensagens de erro mais específicas
      if (error instanceof Error) {
        if (error.message.includes("tempo limite") || error.message.includes("timeout")) {
          setError("Erro de tempo limite ao carregar dados de pagamento.");
        } else {
          setError(error.message);
        }
      } else {
        setError("Erro ao carregar dados de pagamento");
      }
      
      // Usar dados em cache se disponíveis, mesmo que expirados
      const cachedData = dataCache.get(cacheKey);
      if (cachedData) {
        console.log("Usando dados em cache expirados como fallback");
        setPaymentStatusData(cachedData.data);
        
        toast({
          title: "Usando dados em cache",
          description: "Mostrando os últimos dados disponíveis devido a problemas de conexão.",
        });
      } else {
        // Definir dados padrão para uma melhor experiência de fallback
        setPaymentStatusData([
          { name: 'Em Dia', value: 0, color: '#10b981' },
          { name: 'Inadimplentes', value: 0, color: '#ef4444' }
        ]);
      }
    } finally {
      setIsRetrying(false);
    }
  }, [selectedMonth, selectedYear, cacheKey, toast]);

  // Função de retentativa com bypass de cache
  const retry = useCallback(() => {
    return fetchPaymentStatusData(true);
  }, [fetchPaymentStatusData]);

  useEffect(() => {
    // Cancelar requisição anterior se existir
    const controller = new AbortController();
    
    // Apenas buscar se temos mês e ano selecionados
    if (selectedMonth && selectedYear) {
      fetchPaymentStatusData();
    } else {
      // Definir dados padrão se não temos seleção
      setPaymentStatusData([
        { name: 'Em Dia', value: 0, color: '#10b981' },
        { name: 'Inadimplentes', value: 0, color: '#ef4444' }
      ]);
    }
    
    return () => {
      // Limpar requisição ao desmontar
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
