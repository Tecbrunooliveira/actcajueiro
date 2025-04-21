
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { memberService } from "@/services/memberService";
import { memberSchema, MemberFormValues, defaultMemberValues } from "@/schemas/memberSchema";
import { useNavigate } from "react-router-dom";

export const useMemberForm = (memberId?: string) => {
  const isEditMode = !!memberId;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(isEditMode);
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: defaultMemberValues,
  });

  useEffect(() => {
    const fetchMember = async () => {
      if (isEditMode && memberId) {
        try {
          setLoading(true);
          const member = await memberService.getMemberById(memberId);
          if (member) {
            // Ensure warnings array has the required properties
            const formattedWarnings = (member.warnings || []).map(warning => ({
              text: warning.text || '',
              date: warning.date || new Date().toISOString().split('T')[0]
            }));
            
            form.reset({
              name: member.name,
              status: member.status,
              email: member.email || "",
              phone: member.phone || "",
              joinDate: member.joinDate,
              notes: member.notes || "",
              photo: member.photo || "",
              warnings: formattedWarnings,
              user_id: member.user_id || "", // Added user_id field
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
  }, [memberId, isEditMode, form, toast]);

  const onSubmit = async (data: MemberFormValues) => {
    try {
      setSubmitLoading(true);
      
      // Ensure warnings are properly formatted
      const formattedWarnings = (data.warnings || []).map(warning => ({
        text: warning.text,
        date: warning.date
      }));
      
      if (isEditMode && memberId) {
        await memberService.updateMember({ 
          id: memberId, 
          name: data.name,
          status: data.status,
          email: data.email || undefined,
          phone: data.phone || undefined,
          joinDate: data.joinDate,
          notes: data.notes || undefined,
          photo: data.photo || undefined,
          warnings: formattedWarnings,
          user_id: data.user_id || undefined, // Added user_id field
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
          photo: data.photo || undefined,
          warnings: formattedWarnings,
          user_id: data.user_id || undefined, // Added user_id field
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

  return {
    form,
    loading,
    isEditMode,
    submitLoading,
    onSubmit,
  };
};
