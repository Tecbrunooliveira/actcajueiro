
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getMyAnnouncements, confirmAnnouncementReceived } from "@/services/announcementService";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function AnnouncementModal() {
  const { isAdmin } = useAuth();
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Só carrega, não exibe para admin
  useEffect(() => {
    if (!isAdmin) {
      load();
    }
    // eslint-disable-next-line
  }, []);

  async function load() {
    setLoading(true);
    try {
      const items = await getMyAnnouncements();
      setPending(items.filter((item) => item.announcement));
    } catch (e) {
      // não faz nada
    }
    setLoading(false);
  }

  const handleConfirm = async (rowId: string) => {
    setLoading(true);
    try {
      await confirmAnnouncementReceived(rowId);
      toast({ title: "Recebido!", description: "Comunicado confirmado com sucesso." });
      setPending((prev) => prev.filter((p) => p.id !== rowId));
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível confirmar." });
    }
    setLoading(false);
  };

  if (isAdmin || !pending.length) return null;

  // Exibe o comunicado mais recente não lido (1 por vez)
  const current = pending[0];

  return (
    <Dialog open>
      <DialogContent className="max-w-lg">
        <DialogTitle className="mb-1">Comunicado</DialogTitle>
        <div>
          <div className="font-medium">{current.announcement.title}</div>
          <div className="my-2">{current.announcement.content}</div>
          <div className="text-xs text-gray-500">
            Enviado em {new Date(current.announcement.created_at).toLocaleDateString("pt-BR")}
          </div>
        </div>
        <Button
          onClick={() => handleConfirm(current.id)}
          disabled={loading}
          className="w-full mt-4"
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : null}
          Confirmar recebimento
        </Button>
      </DialogContent>
    </Dialog>
  );
}
