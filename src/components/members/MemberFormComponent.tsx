
import React, { useState } from "react";
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
import { X, Plus } from "lucide-react";

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
  const warnings = form.watch("warnings") || [];
  
  const addWarning = () => {
    const currentWarnings = form.getValues("warnings") || [];
    form.setValue("warnings", [
      ...currentWarnings, 
      { text: "", date: new Date().toISOString().split("T")[0] }
    ]);
  };
  
  const removeWarning = (index: number) => {
    const currentWarnings = [...(form.getValues("warnings") || [])];
    currentWarnings.splice(index, 1);
    form.setValue("warnings", currentWarnings);
  };

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

        {/* Warnings Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <FormLabel>Advertências</FormLabel>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addWarning}
              className="flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
          
          {warnings.map((warning, index) => (
            <div key={index} className="flex gap-2 items-start border p-3 rounded-md bg-gray-50">
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Input
                      placeholder="Descrição da advertência"
                      value={warning.text}
                      onChange={(e) => {
                        const newWarnings = [...warnings];
                        newWarnings[index].text = e.target.value;
                        form.setValue("warnings", newWarnings);
                      }}
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      value={warning.date}
                      onChange={(e) => {
                        const newWarnings = [...warnings];
                        newWarnings[index].date = e.target.value;
                        form.setValue("warnings", newWarnings);
                      }}
                    />
                  </div>
                </div>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => removeWarning(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

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
