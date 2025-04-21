
import React from "react";
import { Form } from "@/components/ui/form";
import { useMemberForm } from "@/hooks/useMemberForm";
import { BasicInfoFields } from "./BasicInfoFields";
import { FormButtons } from "./FormButtons";
import { PhotoUpload } from "./PhotoUpload";
import { Textarea } from "@/components/ui/textarea";
import { WarningsSection } from "./WarningsSection";
import { useAuth } from "@/contexts/auth";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface MemberFormComponentProps {
  memberId?: string;
}

export function MemberFormComponent({ memberId }: MemberFormComponentProps) {
  const { form, loading, isEditMode, submitLoading, onSubmit } = useMemberForm(memberId);
  const { isAdmin } = useAuth();

  if (loading) {
    return <div className="py-10 text-center">Carregando...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <PhotoUpload 
            value={form.watch("photo") || ""} 
            onChange={(url) => form.setValue("photo", url)} 
          />
          <BasicInfoFields form={form} />
          
          {/* User ID field (visible only to admins) */}
          {isAdmin && (
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Usuário (para associar conta)</FormLabel>
                  <FormControl>
                    <Input placeholder="ID do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500">
                    Este campo associa o membro a uma conta de usuário do sistema.
                  </p>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Informações adicionais sobre o sócio"
                    className="h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <WarningsSection form={form} />
        </div>

        <FormButtons 
          isEditMode={isEditMode} 
          submitLoading={submitLoading} 
        />
      </form>
    </Form>
  );
}
