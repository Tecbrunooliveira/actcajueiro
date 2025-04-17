
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Member } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "@/schemas/paymentSchema";

interface PaymentBasicFieldsProps {
  form: UseFormReturn<PaymentFormValues>;
  members: Member[];
}

export function PaymentBasicFields({ form, members }: PaymentBasicFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="memberId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sócio</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sócio" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor (R$)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Valor do pagamento"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
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
