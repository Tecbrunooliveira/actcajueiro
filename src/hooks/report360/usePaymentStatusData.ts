
import { useState, useEffect } from "react";
import { paymentService } from "@/services";

export const usePaymentStatusData = (selectedMonth: string, selectedYear: string) => {
  const [paymentStatusData, setPaymentStatusData] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    const fetchPaymentStatusData = async () => {
      try {
        const monthlyRecord = await paymentService.getMonthlyRecord(
          selectedMonth,
          parseInt(selectedYear)
        );
        
        const data = [
          { name: 'Em Dia', value: monthlyRecord.paidMembers, color: '#10b981' },
          { name: 'Inadimplentes', value: monthlyRecord.unpaidMembers, color: '#ef4444' }
        ];
        
        setPaymentStatusData(data);
      } catch (error) {
        console.error("Error fetching payment status data:", error);
      }
    };

    fetchPaymentStatusData();
  }, [selectedMonth, selectedYear]);

  return { paymentStatusData };
};
