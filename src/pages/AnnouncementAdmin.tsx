
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { memberService } from "@/services/memberService";
import { createAnnouncement } from "@/services/announcementService";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Send, UserIcon, Globe } from "lucide-react";

const AnnouncementAdmin = () => {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    is_global: false,
    memberIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      try {
        setLoadingMembers(true);
        const data = await memberService.getAllMembers();
        setMembers(data || []);
      } catch (err) {
        console.error("Error loading members:", err);
        toast({ 
          title: "Erro ao carregar sócios", 
          description: "Não foi possível carregar a lista de sócios.",
          variant: "destructive"
        });
      } finally {
        setLoadingMembers(false);
      }
    }
    
    if (isAdmin) {
      loadMembers();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <MobileLayout title="Central de Comunicados">
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Você não tem permissão para acessar esta página.</p>
            </div>
          </CardContent>
        </Card>
      </MobileLayout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheck = (member_id: string) => {
    setForm((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(member_id)
        ? prev.memberIds.filter((id) => id !== member_id)
        : [...prev.memberIds, member_id],
    }));
  };

  const handleToggleGlobal = (checked: boolean) => {
    setForm(f => ({ 
      ...f, 
      is_global: checked, 
      memberIds: checked ? [] : f.memberIds 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: "Preencha todos os campos" });
      return;
    }
    if (!form.is_global && !form.memberIds.length) {
      toast({ title: "Selecione ao menos 1 sócio" });
      return;
    }
    setLoading(true);
    try {
      await createAnnouncement({
        title: form.title,
        content: form.content,
        is_global: form.is_global,
        memberIds: form.memberIds,
      });
      toast({ title: "Comunicado enviado!", description: "O comunicado foi enviado com sucesso." });
      setForm({ title: "", content: "", is_global: false, memberIds: [] });
    } catch (error) {
      console.error("Error sending announcement:", error);
      toast({ 
        title: "Erro ao enviar comunicado!", 
        description: "Não foi possível enviar o comunicado. Tente novamente.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout title="Central de Comunicados">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="mr-2 h-5 w-5" />
            Novo Comunicado
          </CardTitle>
          <CardDescription>
            Envie comunicados importantes para os sócios da associação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                placeholder="Título do comunicado"
                value={form.title}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="content">Mensagem</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Conteúdo do comunicado"
                value={form.content}
                onChange={handleChange}
                className="w-full"
                rows={5}
              />
            </div>
            
            <div className="flex items-center space-x-2 py-2">
              <Switch 
                id="is_global" 
                checked={form.is_global} 
                onCheckedChange={handleToggleGlobal}
              />
              <Label htmlFor="is_global" className="flex items-center cursor-pointer">
                <Globe className="mr-2 h-4 w-4" />
                Enviar para todos os sócios
              </Label>
            </div>
            
            {!form.is_global && (
              <div>
                <Label className="flex items-center mb-2">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Selecione os destinatários ({form.memberIds.length} selecionados)
                </Label>
                <div className="max-h-60 overflow-y-auto border p-3 rounded-md space-y-2">
                  {loadingMembers ? (
                    <div className="text-center py-2">Carregando sócios...</div>
                  ) : members.length === 0 ? (
                    <div className="text-center py-2">Nenhum sócio encontrado</div>
                  ) : (
                    members.map((m) => (
                      <div key={m.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          id={`member-${m.id}`}
                          checked={form.memberIds.includes(m.id)}
                          onChange={() => handleCheck(m.id)}
                          className="rounded"
                        />
                        <label 
                          htmlFor={`member-${m.id}`} 
                          className="flex-grow cursor-pointer flex items-center"
                        >
                          {m.name}
                          {form.memberIds.includes(m.id) && (
                            <Check className="ml-2 h-4 w-4 text-green-500" />
                          )}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full"
            >
              {loading ? "Enviando..." : "Enviar Comunicado"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </MobileLayout>
  );
};

export default AnnouncementAdmin;
