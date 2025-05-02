
import { useState, useEffect, useCallback } from "react";
import { paymentService } from "@/services";

export const useMonthlyRecord = (month: string, year: string, shouldLoad = false) => {
  const [monthlyRecord, setMonthlyRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadMonthlyRecord = useCallback(async () => {
    // Não tenta carregar sem mês ou ano
    if (!month || !year) {
      console.log("Month or year parameter is empty, skipping load");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`Loading monthly record for: ${month}`);
      
      // Convert year string to number to match the expected type
      const yearNumber = parseInt(year, 10);
      
      // Validação extra para evitar chamadas com valores inválidos
      if (isNaN(yearNumber)) {
        throw new Error("Ano inválido");
      }
      
      const record = await paymentService.getMonthlyRecord(month, yearNumber);
      setMonthlyRecord(record);
    } catch (err) {
      console.error("Error fetching monthly record:", err);
      
      if (err instanceof Error) {
        // Mensagens de erro mais detalhadas
        if (err.message.includes("tempo limite") || err.message.includes("timeout")) {
          setError("Erro de tempo limite. O servidor está demorando para responder.");
        } else if (err.message.includes("statement")) {
          setError("Erro do banco de dados. Tente novamente mais tarde.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Erro de tempo limite. O servidor está demorando para responder.");
      }
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  // Only load data when explicitly triggered and when month/year are valid
  useEffect(() => {
    if (shouldLoad && month && year) {
      loadMonthlyRecord();
    }
  }, [loadMonthlyRecord, month, year, shouldLoad, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return {
    monthlyRecord,
    loadingMonthlyRecord: loading,
    error,
    retry
  };
};
