
import { useState, useEffect, useCallback } from "react";
import { useMemberStatusData } from "./report360/useMemberStatusData";
import { usePaymentStatusData } from "./report360/usePaymentStatusData";
import { useExpensesData } from "./report360/useExpensesData";
import { useFinancialSummary } from "./report360/useFinancialSummary";
import { useToast } from "@/components/ui/use-toast";

// Dados em cache persistentes entre renderizações de página
const globalCachedData = {
  memberStatus: null,
  paymentStatus: null,
  expenses: null,
  financialSummary: null
};

export const useReport360Data = (selectedMonth: string, selectedYear: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Carregar dados somente se a aba estiver ativa para melhorar performance
  const isActiveTab = selectedMonth && selectedYear;
  
  // Usar hooks menores com carregamento otimizado
  const { 
    memberStatusData, 
    error: memberError, 
    retry: retryMemberData,
    isRetrying: isMemberRetrying
  } = useMemberStatusData();
  
  const { 
    paymentStatusData, 
    error: paymentError, 
    retry: retryPaymentData,
    isRetrying: isPaymentRetrying
  } = usePaymentStatusData(isActiveTab ? selectedMonth : '', isActiveTab ? selectedYear : '');
  
  const { 
    expensesData, 
    error: expensesError, 
    retry: retryExpensesData,
    isRetrying: isExpensesRetrying
  } = useExpensesData(isActiveTab ? selectedMonth : '', isActiveTab ? selectedYear : '');
  
  const { 
    financialSummary, 
    error: financialError, 
    retry: retryFinancialData,
    isRetrying: isFinancialRetrying
  } = useFinancialSummary(isActiveTab ? selectedMonth : '', isActiveTab ? selectedYear : '');

  // Atualizar cache global quando dados estão disponíveis
  useEffect(() => {
    if (memberStatusData.length > 0) globalCachedData.memberStatus = memberStatusData;
    if (paymentStatusData.length > 0) globalCachedData.paymentStatus = paymentStatusData;
    if (expensesData.length > 0) globalCachedData.expenses = expensesData;
    if (financialSummary.totalIncome !== undefined) globalCachedData.financialSummary = financialSummary;
  }, [memberStatusData, paymentStatusData, expensesData, financialSummary]);

  // Monitorar se algum hook está tentando novamente
  useEffect(() => {
    setIsRetrying(
      isMemberRetrying || 
      isPaymentRetrying || 
      isExpensesRetrying || 
      isFinancialRetrying
    );
  }, [isMemberRetrying, isPaymentRetrying, isExpensesRetrying, isFinancialRetrying]);

  // Combinar todos os erros
  useEffect(() => {
    // Se não estiver na aba ativa, limpar erros
    if (!isActiveTab) {
      setError(null);
      return;
    }
    
    const errors = [memberError, paymentError, expensesError, financialError].filter(Boolean);
    
    if (errors.length > 0) {
      // Priorizar mostrar erros de timeout
      const timeoutError = errors.find(err => 
        err?.toLowerCase().includes("tempo limite") || 
        err?.toLowerCase().includes("timeout")
      );
      
      if (timeoutError) {
        setError("Tempo limite excedido. O servidor está demorando para responder.");
      } else {
        setError(errors[0] || "Erro ao carregar dados do relatório 360°");
      }
    } else {
      setError(null);
    }
  }, [memberError, paymentError, expensesError, financialError, isActiveTab]);

  // Melhorar gerenciamento de estado de carregamento
  useEffect(() => {
    // Se não estiver na aba ativa, definir como não carregando
    if (!isActiveTab) {
      setLoading(false);
      return;
    }
    
    try {
      // Usar dados em cache se disponíveis enquanto espera por dados novos
      if (globalCachedData.memberStatus && globalCachedData.paymentStatus && 
          globalCachedData.expenses && globalCachedData.financialSummary) {
        // Se temos dados em cache, mostrar imediatamente e continuar carregando em segundo plano
        setLoading(false);
      }
      
      // Atualizar para lidar com carregamento parcial de dados
      const hasPartialData = 
        (memberStatusData.length > 0 || expensesData.length > 0 || 
         paymentStatusData.length > 0 || financialSummary.totalIncome !== undefined);
      
      // Definir carregamento como falso após timeout ou quando temos alguns dados para mostrar
      if (hasPartialData) {
        setLoading(false);
      } else if (!hasPartialData && (memberError || paymentError || expensesError || financialError)) {
        // Se temos erros e nenhum dado, parar de carregar após um curto atraso
        const timer = setTimeout(() => {
          setLoading(false);
        }, 300); // Reduzido de 500ms
        
        return () => clearTimeout(timer);
      }
      
      // Adicionar timeout de segurança para evitar estado de carregamento infinito
      const timer = setTimeout(() => {
        if (loading) {
          setLoading(false);
          if (!error) {
            setError("Tempo limite excedido ao carregar os dados. Tente novamente.");
          }
        }
      }, 7000); // Reduzido de 10 segundos para 7 segundos
      
      return () => clearTimeout(timer);
      
    } catch (err) {
      console.error("Error in Report360 data loading:", err);
      setError("Erro ao carregar dados do relatório 360°");
      setLoading(false);
    }
  }, [memberStatusData, paymentStatusData, expensesData, financialSummary, 
      memberError, paymentError, expensesError, financialError, loading, error, isActiveTab]);

  // Função de retentativa com melhor desempenho
  const retry = useCallback(() => {
    if (!isActiveTab) return;
    
    setLoading(true);
    setError(null);
    setIsRetrying(true);
    
    // Mostrar notificação toast
    toast({
      title: "Recarregando dados",
      description: "Tentando buscar os dados novamente...",
    });
    
    // Tentar novamente todos os carregamentos de dados em paralelo
    Promise.all([
      retryMemberData(),
      retryPaymentData(),
      retryExpensesData(),
      retryFinancialData()
    ]).catch(e => {
      console.error("Error during retry:", e);
    }).finally(() => {
      setIsRetrying(false);
    });
    
    // Adicionar timeout de segurança mais curto para operação de tentativa
    setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 8000); // Reduzido para 8 segundos
  }, [retryMemberData, retryPaymentData, retryExpensesData, retryFinancialData, 
      toast, loading, isActiveTab]);

  return {
    loading,
    isRetrying,
    memberStatusData: memberStatusData.length > 0 ? memberStatusData : (globalCachedData.memberStatus || []),
    paymentStatusData: paymentStatusData.length > 0 ? paymentStatusData : (globalCachedData.paymentStatus || []),
    expensesData: expensesData.length > 0 ? expensesData : (globalCachedData.expenses || []),
    financialSummary: financialSummary.totalIncome !== undefined ? financialSummary : (globalCachedData.financialSummary || { totalIncome: 0, totalExpenses: 0, balance: 0 }),
    error,
    retry
  };
};
