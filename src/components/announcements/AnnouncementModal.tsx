
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getMyAnnouncements, confirmAnnouncementReceived } from "@/services/announcementService";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function AnnouncementModal() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Carrega os comunicados quando o usuário estiver autenticado e não for admin
  useEffect(() => {
    if (isAuthenticated && !isAdmin && !initialized) {
      console.log("AnnouncementModal: User is authenticated and not admin, loading announcements");
      load();
      setInitialized(true);
    } else {
      console.log("AnnouncementModal: Not loading announcements", { isAuthenticated, isAdmin, initialized });
    }
  }, [isAuthenticated, isAdmin, initialized]);

  async function load() {
    setLoading(true);
    try {
      console.log("Loading announcements for member");
      const items = await getMyAnnouncements();
      console.log("Announcements loaded:", items);
      
      if (items && items.length > 0) {
        console.log("Setting pending announcements:", items);
        setPending(items);
      } else {
        console.log("No announcements to display");
      }
    } catch (e) {
      console.error("Error loading announcements:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleConfirm = async (rowId: string) => {
    setLoading(true);
    try {
      await confirmAnnouncementReceived(rowId);
      toast({ title: "Recebido!", description: "Comunicado confirmado com sucesso." });
      setPending((prev) => prev.filter((p) => p.id !== rowId));
    } catch (e) {
      console.error("Error confirming announcement:", e);
      toast({ title: "Erro", description: "Não foi possível confirmar." });
    }
    setLoading(false);
  };

  // Não mostra para usuários não autenticados, admin, ou se não houver comunicados pendentes
  if (!isAuthenticated || isAdmin || !pending.length) {
    return null;
  }

  // Exibe o comunicado mais recente não lido (1 por vez)
  const current = pending[0];

  return (
    <Dialog open>
      <DialogContent className="max-w-lg">
        <DialogTitle className="mb-1">Comunicado</DialogTitle>
        <DialogDescription className="sr-only">
          Comunicado oficial da associação
        </DialogDescription>
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
