
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { memberService } from "@/services/memberService";
import { createAnnouncement } from "@/services/announcementService";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

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

  useEffect(() => {
    async function loadMembers() {
      const data = await memberService.getAllMembers();
      setMembers(data);
    }
    loadMembers();
  }, []);

  if (!isAdmin) return <div>Você não tem permissão.</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheck = (member_id: string) => {
    setForm((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(member_id)
        ? prev.memberIds.filter((id) => id !== member_id)
        : [...prev.memberIds, member_id],
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
      toast({ title: "Comunicado enviado!" });
      setForm({ title: "", content: "", is_global: false, memberIds: [] });
    } catch {
      toast({ title: "Erro ao enviar comunicado!", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-xl mx-auto mt-6">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Novo Comunicado</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <textarea
            name="content"
            placeholder="Mensagem"
            value={form.content}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_global"
              checked={form.is_global}
              onChange={() => setForm(f => ({ ...f, is_global: !f.is_global, memberIds: [] }))}
            />
            <label htmlFor="is_global">Enviar para todos</label>
          </div>
          {!form.is_global && (
            <div className="max-h-40 overflow-y-auto border p-2 rounded mb-2">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.memberIds.includes(m.id)}
                    onChange={() => handleCheck(m.id)}
                    id={m.id}
                  />
                  <label htmlFor={m.id}>{m.name}</label>
                </div>
              ))}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Enviando..." : "Enviar Comunicado"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AnnouncementAdmin;
