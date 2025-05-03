import React, { useState, useRef } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Member } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "@/schemas/paymentSchema";

interface PaymentBasicFieldsProps {
  form: UseFormReturn<PaymentFormValues>;
  members: Member[];
}

export function PaymentBasicFields({ form, members }: PaymentBasicFieldsProps) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Função para formatar valor como moeda brasileira
  function formatCurrencyBR(value: string) {
    const clean = value.replace(/\D/g, "");
    const number = parseFloat(clean) / 100;
    if (isNaN(number)) return "";
    return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <FormField
        control={form.control}
        name="memberId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sócio</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Digite o nome do sócio..."
                  value={search || (members.find(m => m.id === field.value)?.name || "")}
                  onChange={e => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                    field.onChange("");
                  }}
                  onFocus={() => setShowDropdown(true)}
                  autoComplete="off"
                />
                {showDropdown && filteredMembers.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full mt-1 max-h-48 overflow-auto rounded shadow">
                    {filteredMembers.map((member) => (
                      <li
                        key={member.id}
                        className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                        onClick={() => {
                          field.onChange(member.id);
                          setSearch(member.name);
                          setShowDropdown(false);
                        }}
                      >
                        {member.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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

      <div className="flex gap-2">
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Mês</FormLabel>
              <FormControl>
                <Input
                  type="month"
                  placeholder="YYYY-MM"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Ano</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ano"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
