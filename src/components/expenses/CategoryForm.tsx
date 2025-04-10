
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { ExpenseCategory } from "@/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  description: z.string().optional(),
  color: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, { 
    message: "Insira uma cor HEX válida (ex: #ff0000)" 
  }).optional(),
});

type CategoryFormProps = {
  onSubmit: (data: Omit<ExpenseCategory, "id">) => Promise<void>;
  initialData?: ExpenseCategory;
  onCancel: () => void;
};

export function CategoryForm({ onSubmit, initialData, onCancel }: CategoryFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      color: initialData?.color || "#3b82f6",
    },
  });

  const handleSubmit = async (data: z.infer<typeof categorySchema>) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a categoria.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {initialData ? "Editar Categoria" : "Nova Categoria"}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome da categoria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição da categoria" 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input {...field} type="color" className="w-12 h-10 p-1" />
                </FormControl>
                <Input 
                  {...field} 
                  placeholder="#000000" 
                  className="flex-1"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith('#') || value === '') {
                      field.onChange(value);
                    }
                  }}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Atualizar" : "Criar"} Categoria
          </Button>
        </div>
      </form>
    </Form>
  );
}
