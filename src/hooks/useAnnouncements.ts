
import { useState, useEffect } from "react";
import { announcementService } from "@/services";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

export function useAnnouncements() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isFixingRecords, setIsFixingRecords] = useState(false);

  const load = async () => {
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
  };

  const handleFixOrphanedRecords = async () => {
    if (!isAdmin) return;
    
    setIsFixingRecords(true);
    try {
      if (announcementService.announcementQueryService) {
        await announcementService.announcementQueryService.cleanupOrphanedRecipients();
        toast({
          title: "Registros corrigidos",
          description: "Os registros de comunicados foram corrigidos com sucesso.",
        });
        handleReload();
      } else {
        toast({
          title: "Erro",
          description: "Função de correção não está disponível.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fixing orphaned records:", error);
      toast({
        title: "Erro",
        description: "Não foi possível corrigir os registros.",
        variant: "destructive",
      });
    } finally {
      setIsFixingRecords(false);
    }
  };

  const handleReload = () => {
    setPending([]);
    setInitialized(false);
    load();
  };

  const handleConfirm = async (rowId: string) => {
    setLoading(true);
    try {
      await announcementService.confirmAnnouncementReceived(rowId);
      toast({ title: "Recebido!", description: "Comunicado confirmado com sucesso." });
      
      setPending((prev) => {
        const newPending = prev.filter((p) => p.id !== rowId);
        if (newPending.length === 0) {
          return [];
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

  useEffect(() => {
    if (isAuthenticated && !initialized) {
      console.log("AnnouncementModal: User is authenticated, loading announcements");
      load();
      setInitialized(true);
    } else {
      console.log("AnnouncementModal: Not loading announcements", { isAuthenticated, isAdmin, initialized });
    }
  }, [isAuthenticated, isAdmin, initialized]);

  return {
    pending,
    loading,
    error,
    currentIndex,
    isFixingRecords,
    setCurrentIndex,
    handleReload,
    handleConfirm,
    handleFixOrphanedRecords,
  };
}
