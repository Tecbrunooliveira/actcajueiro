
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useParams, useNavigate } from "react-router-dom";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  memberService,
  getStatusLabel
} from "@/services/dataService";
import { MemberStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

const memberSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  status: z.enum(["frequentante", "afastado", "advertido"] as const),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  joinDate: z.string().min(1, "Data de entrada é obrigatória"),
  notes: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

const MemberForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      status: "frequentante",
      email: "",
      phone: "",
      joinDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  useEffect(() => {
    const fetchMember = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const member = await memberService.getMemberById(id);
          if (member) {
            form.reset({
              name: member.name,
              status: member.status,
              email: member.email || "",
              phone: member.phone || "",
              joinDate: member.joinDate,
              notes: member.notes || "",
            });
          }
        } catch (error) {
          console.error("Error fetching member:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do sócio",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMember();
  }, [id, isEditMode, form, toast]);

  const onSubmit = async (data: MemberFormValues) => {
    try {
      setSubmitLoading(true);
      
      if (isEditMode && id) {
        await memberService.updateMember({ 
          id, 
          ...data,
          email: data.email || undefined,
          phone: data.phone || undefined,
          notes: data.notes || undefined,
        });
        
        toast({
          title: "Sócio atualizado",
          description: "As informações do sócio foram atualizadas com sucesso",
        });
      } else {
        await memberService.createMember({
          name: data.name,
          status: data.status,
          joinDate: data.joinDate,
          email: data.email || undefined,
          phone: data.phone || undefined,
          notes: data.notes || undefined,
        });
        
        toast({
          title: "Sócio criado",
          description: "O novo sócio foi criado com sucesso",
        });
      }
      
      navigate("/members");
    } catch (error) {
      console.error("Error saving member:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o sócio",
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout title={isEditMode ? "Editar Sócio" : "Novo Sócio"}>
        <div className="flex items-center justify-center h-full py-10">
          <p>Carregando dados...</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      title={isEditMode ? "Editar Sócio" : "Novo Sócio"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
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
    </MobileLayout>
  );
};

export default MemberForm;
