
import { useState, useEffect, useCallback } from "react";
import { paymentService } from "@/services";

export const useMonthlyRecord = (month: string, year: string, shouldLoad = false) => {
  const [monthlyRecord, setMonthlyRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadMonthlyRecord = useCallback(async () => {
    if (!month) {
      console.log("Month parameter is empty, skipping load");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`Loading monthly record for: ${month}`);
      
      const record = await paymentService.getMonthlyRecord(month, year);
      setMonthlyRecord(record);
    } catch (err) {
      console.error("Error fetching monthly record:", err);
      setError("Erro de tempo limite. O servidor está demorando para responder.");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  // Only load data when explicitly triggered
  useEffect(() => {
    if (shouldLoad && month) {
      loadMonthlyRecord();
    }
  }, [loadMonthlyRecord, month, shouldLoad, retryCount]);

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
