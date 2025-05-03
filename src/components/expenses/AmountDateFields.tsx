import React, { useRef, useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ExpenseFormValues } from "@/hooks/useExpenseForm";

type AmountDateFieldsProps = {
  form: UseFormReturn<ExpenseFormValues>;
};

export function AmountDateFields({ form }: AmountDateFieldsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => {
          const [localValue, setLocalValue] = useState(field.value !== undefined && field.value !== null && String(field.value) !== '' ? String(field.value).replace('.', ',') : "");

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let value = e.target.value.replace(/[^\d.,]/g, "");
            setLocalValue(value);
            field.onChange(value);
          };

          const handleBlur = () => {
            if (localValue === "") return;
            let value = localValue.replace(/\./g, "").replace(/,/g, ".");
            const number = parseFloat(value);
            if (!isNaN(number)) {
              setLocalValue(number.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
              field.onChange(number);
            } else {
              setLocalValue("");
              field.onChange("");
            }
            field.onBlur();
          };

          return (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-500 select-none">R$</span>
                  <Input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    pattern="^\d+(,\d{0,2})?$"
                    min={0}
                    className="pl-10"
                    placeholder="0,00"
                    value={localValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
