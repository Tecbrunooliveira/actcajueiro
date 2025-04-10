
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getStatusLabel } from "@/services/formatters";
import { MemberStatus } from "@/types";
import { MemberFormValues } from "@/schemas/memberSchema";
import { UseFormReturn } from "react-hook-form";
import { PhoneInput } from "./PhoneInput";
import { PhotoUpload } from "./PhotoUpload";

interface MemberFormComponentProps {
  form: UseFormReturn<MemberFormValues>;
  onSubmit: (data: MemberFormValues) => Promise<void>;
  isEditMode: boolean;
  submitLoading: boolean;
}

export const MemberFormComponent = ({
  form,
  onSubmit,
  isEditMode,
  submitLoading,
}: MemberFormComponentProps) => {
  const navigate = useNavigate();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center pb-2">
              <PhotoUpload
                value={field.value || ""}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

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
                  {(["frequentante", "afastado", "advertido"] as MemberStatus[]).map(
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

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/members")}
            disabled={submitLoading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-club-500 hover:bg-club-600"
            disabled={submitLoading}
          >
            {submitLoading ? "Salvando..." : isEditMode ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
