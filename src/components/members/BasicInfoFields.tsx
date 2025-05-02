
import React, { useEffect, useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getStatusLabel } from "@/services/formatters";
import { MemberStatus, Position } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { MemberFormValues } from "@/schemas/memberSchema";
import { PhoneInput } from "./PhoneInput";
import { StarRatingInput } from "./StarRatingInput";
import { positionService } from "@/services/memberService";

interface BasicInfoFieldsProps {
  form: UseFormReturn<MemberFormValues>;
}

export const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    positionService.getAll().then(setPositions);
  }, []);

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Nome completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nível</FormLabel>
            <FormControl>
              <StarRatingInput value={field.value || 0} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Use Select with options from positions */}
      <FormField
        control={form.control}
        name="position_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Posição</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a posição" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {positions.map(pos => (
                  <SelectItem key={pos.id} value={pos.id}>
                    {pos.name}
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
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(["frequentante", "afastado"] as MemberStatus[]).map(
                  (status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <PhoneInput field={field} />
        )}
      />

      <FormField
        control={form.control}
        name="joinDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Entrada</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Informações adicionais..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
