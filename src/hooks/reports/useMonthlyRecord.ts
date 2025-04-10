
import { useState, useEffect } from "react";
import { MonthlyRecord } from "@/types";
import { paymentService } from "@/services";

export const useMonthlyRecord = (selectedMonth: string, selectedYear: string) => {
  const [monthlyRecord, setMonthlyRecord] = useState<MonthlyRecord>({
    month: "",
    year: 0,
    totalMembers: 0,
    paidMembers: 0,
    unpaidMembers: 0,
    totalAmount: 0,
    collectedAmount: 0,
  });

  useEffect(() => {
    const fetchMonthlyRecord = async () => {
      try {
        const fetchedMonthlyRecord = await paymentService.getMonthlyRecord(
          selectedMonth,
          parseInt(selectedYear)
        );
        
        setMonthlyRecord(fetchedMonthlyRecord);
      } catch (error) {
        console.error("Error fetching monthly record:", error);
      }
    };
    
    fetchMonthlyRecord();
  }, [selectedMonth, selectedYear]);

  return { monthlyRecord };
};
