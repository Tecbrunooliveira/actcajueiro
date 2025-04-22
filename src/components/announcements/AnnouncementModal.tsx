
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getMyAnnouncements, confirmAnnouncementReceived } from "@/services/announcementService";
import { useAuth } from "@/contexts/auth";
import { Loader2, ArrowLeft, ArrowRight, Flag, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

export function AnnouncementModal() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

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

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < pending.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleGoToAnnouncements = () => {
    navigate("/admin/announcements");
  };

  const handleReload = () => {
    setPending([]);
    setInitialized(false);
  };

  // Não mostra para usuários não autenticados, admin, ou se não houver comunicados pendentes
  if (!isAuthenticated || isAdmin || !pending.length) {
    return null;
  }

  // Exibe o comunicado atual
  const current = pending[currentIndex];
  
  // Certifique-se de que o comunicado atual é válido
  if (!current || !current.announcement) {
    console.error("Current announcement is invalid:", current);
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-1 flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Comunicado
            <div className="text-sm text-gray-500 ml-auto">
              {currentIndex + 1} de {pending.length}
            </div>
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Comunicado oficial da associação
          </DialogDescription>
        </DialogHeader>

        <Menubar className="mb-4">
          <MenubarMenu>
            <MenubarTrigger>Ações</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleReload}>Recarregar</MenubarItem>
              {isAdmin && (
                <MenubarItem onClick={handleGoToAnnouncements}>
                  Gerenciar Comunicados
                </MenubarItem>
              )}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="font-medium text-lg">{current.announcement.title}</div>
            <div className="my-2 whitespace-pre-wrap">{current.announcement.content}</div>
            <div className="text-xs text-gray-500 mt-4">
              Enviado em {new Date(current.announcement.created_at).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          {pending.length > 1 && (
            <div className="flex space-x-2 mr-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0 || loading}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === pending.length - 1 || loading}
              >
                Próximo <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
          
          <Button
            onClick={() => handleConfirm(current.id)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Confirmar recebimento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
