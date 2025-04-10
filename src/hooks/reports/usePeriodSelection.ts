
import { useState } from "react";
import { getCurrentMonthYear, formatMonthYear } from "@/services/formatters";

export const usePeriodSelection = () => {
  const currentDate = getCurrentMonthYear();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.month);
  const [selectedYear, setSelectedYear] = useState(currentDate.year.toString());

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthStr = String(month).padStart(2, "0");
    const date = new Date(parseInt(selectedYear), i);
    return {
      value: `${selectedYear}-${monthStr}`,
      label: date.toLocaleDateString("pt-BR", { month: "long" }),
    };
  });

  // Generate year options
  const yearOptions = Array.from(
    { length: 7 },
    (_, i) => (currentDate.year - 5 + i).toString()
  );

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    // Update month with new year
    const [_, month] = selectedMonth.split("-");
    setSelectedMonth(`${value}-${month}`);
  };

  return {
    selectedMonth,
    selectedYear,
    monthOptions,
    yearOptions,
    handleMonthChange,
    handleYearChange,
    formatMonthYear
  };
};
