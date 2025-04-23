
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { announcementService } from "@/services";
import { useAuth } from "@/contexts/auth";
import { Loader2, ArrowLeft, ArrowRight, Bell, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

export function AnnouncementModal() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Load announcements when the user is authenticated and not an admin
  useEffect(() => {
    if (isAuthenticated && !isAdmin && !initialized) {
      console.log("AnnouncementModal: User is authenticated and not admin, loading announcements");
      load();
      setInitialized(true);
    } else {
      console.log("AnnouncementModal: Not loading announcements", { isAuthenticated, isAdmin, initialized });
    }
  }, [isAuthenticated, isAdmin, initialized]);

  // Automatically open the dialog when we have pending announcements
  useEffect(() => {
    if (pending.length > 0) {
      console.log("Opening announcement modal with", pending.length, "announcements");
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [pending]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      console.log("Loading announcements for member");
      const items = await announcementService.getMyAnnouncements();
      console.log("Announcements loaded:", items);
      
      if (items && items.length > 0) {
        console.log("Setting pending announcements:", items);
        setPending(items);
        setCurrentIndex(0);
      } else {
        console.log("No announcements to display");
        setPending([]);
      }
    } catch (e) {
      console.error("Error loading announcements:", e);
      setError("Não foi possível carregar os comunicados. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  const handleConfirm = async (rowId: string) => {
    setLoading(true);
    try {
      await announcementService.confirmAnnouncementReceived(rowId);
      toast({ title: "Recebido!", description: "Comunicado confirmado com sucesso." });
      
      // Remove the confirmed announcement from the list
      setPending((prev) => {
        const newPending = prev.filter((p) => p.id !== rowId);
        if (newPending.length === 0) {
          setIsOpen(false);
        } else if (currentIndex >= newPending.length) {
          setCurrentIndex(newPending.length - 1);
        }
        return newPending;
      });
    } catch (e) {
      console.error("Error confirming announcement:", e);
      toast({ 
        title: "Erro", 
        description: "Não foi possível confirmar o recebimento.", 
        variant: "destructive" 
      });
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
    load();
  };

  // Don't render anything if the user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-1 flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Comunicado
            {pending.length > 0 && (
              <div className="text-sm text-gray-500 ml-auto">
                {currentIndex + 1} de {pending.length}
              </div>
            )}
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

        {loading && (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-4" />
            <p className="text-gray-500">Carregando comunicados...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 mr-2" />
              <strong>Erro ao carregar comunicados</strong>
            </div>
            <p>{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={handleReload}>
              Tentar novamente
            </Button>
          </div>
        )}

        {!loading && !error && pending.length > 0 && pending[currentIndex]?.announcement && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div className="font-medium text-lg">{pending[currentIndex].announcement.title}</div>
              <div className="my-2 whitespace-pre-wrap">{pending[currentIndex].announcement.content}</div>
              <div className="text-xs text-gray-500 mt-4">
                Enviado em {new Date(pending[currentIndex].announcement.created_at).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>
        )}

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
          
          {!loading && !error && pending.length > 0 && pending[currentIndex] && (
            <Button
              onClick={() => handleConfirm(pending[currentIndex].id)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Confirmar recebimento
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
