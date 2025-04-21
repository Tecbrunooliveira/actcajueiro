
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { memberService } from "@/services/memberService";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserPlus, Loader2 } from "lucide-react";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const allMembers = await memberService.getAllMembers();
      // Filtra membros que ainda não possuem um user_id associado
      const membersWithoutUsers = allMembers.filter(m => !m.user_id);
      setMembers(membersWithoutUsers);
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
    setErrorMessage(null);
    
    try {
      // Cria o user auth usando a Edge Function
      const { userId, error } = await userService.createUser(newUserEmail, newUserPassword);
      
      if (error || !userId) {
        setErrorMessage(error?.message || "Falha ao criar usuário.");
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
          Crie um novo usuário (e-mail e senha), e associe a um sócio existente que ainda não possua acesso.
        </div>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Erro ao criar usuário:</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleCreateAndAssign} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Sócio sem acesso ao sistema</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedMemberId}
              onChange={e => setSelectedMemberId(e.target.value)}
              required
            >
              <option value="">Selecione um sócio...</option>
              {members.length === 0 && !loading ? (
                <option value="" disabled>Não há sócios sem usuário associado</option>
              ) : (
                members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} {member.email ? `(${member.email})` : ""}
                  </option>
                ))
              )}
            </select>
            {members.length === 0 && !loading && (
              <p className="mt-1 text-sm text-amber-600">
                Todos os sócios já possuem usuários associados.
              </p>
            )}
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
              minLength={6}
            />
            <p className="mt-1 text-xs text-gray-500">A senha deve ter no mínimo 6 caracteres</p>
          </div>
          <Button
            type="submit"
            className="w-full bg-club-500 hover:bg-club-600 mt-2"
            disabled={submitting || members.length === 0}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Criar e Associar Usuário
              </>
            )}
          </Button>
        </form>
        <div className="mt-6 text-xs text-gray-400">
          Só o administrador vê essa página.
        </div>
      </div>
    </MobileLayout>
  );
};

export default AdminUsers;
