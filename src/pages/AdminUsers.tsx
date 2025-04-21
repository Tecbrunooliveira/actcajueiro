
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { memberService } from "@/services/memberService";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/userService";

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const allMembers = await memberService.getAllMembers();
      setMembers(allMembers);
    } catch (error) {
      toast({
        title: "Erro ao carregar sócios",
        description: "Não foi possível listar os sócios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Permite acesso apenas ao admin
    if (user?.email !== "admin@example.com") {
      navigate("/");
      return;
    }
    loadMembers();
  }, [user, navigate]);

  const handleCreateAndAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !newUserEmail || !newUserPassword) return;

    setSubmitting(true);
    try {
      // Cria o user auth no Supabase
      const { userId, error } = await userService.createUser(newUserEmail, newUserPassword);
      if (error || !userId) {
        throw new Error(error?.message || "Falha ao criar usuário.");
      }

      // Atualiza o sócio para associar o novo user_id
      await memberService.updateMember({
        ...(members.find(m => m.id === selectedMemberId)),
        user_id: userId,
      });

      toast({
        title: "Usuário criado e associado!",
        description: "Usuário criado e associado ao sócio selecionado.",
      });
      // Limpa os campos e recarrega membros
      setSelectedMemberId("");
      setNewUserEmail("");
      setNewUserPassword("");
      await loadMembers();
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Erro ao criar ou associar usuário.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MobileLayout title="Criar e associar usuário">
      <div className="mb-8">
        <div className="mb-3 text-sm text-gray-500">
          Crie um novo usuário (e-mail e senha), e associe a um sócio existente.
        </div>
        <form onSubmit={handleCreateAndAssign} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Sócio</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedMemberId}
              onChange={e => setSelectedMemberId(e.target.value)}
              required
            >
              <option value="">Selecione um sócio...</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} {member.email ? `(${member.email})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">E-mail do novo usuário</label>
            <Input
              type="email"
              value={newUserEmail}
              onChange={e => setNewUserEmail(e.target.value)}
              placeholder="usuario@email.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Senha</label>
            <Input
              type="password"
              value={newUserPassword}
              onChange={e => setNewUserPassword(e.target.value)}
              placeholder="Senha"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-club-500 hover:bg-club-600 mt-2"
            disabled={submitting}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {submitting ? "Criando..." : "Criar e Associar Usuário"}
          </Button>
        </form>
        <div className="mt-6 text-xs text-gray-400">
          Só o administrador vê essa página.
        </div>
      </div>
    </MobileLayout>
  )
};

export default AdminUsers;
