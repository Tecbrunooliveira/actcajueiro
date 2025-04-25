
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth";
import { Loader2, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { AnnouncementError } from "./AnnouncementError";
import { AnnouncementEmpty } from "./AnnouncementEmpty";
import { AnnouncementContent } from "./AnnouncementContent";
import { useAnnouncements } from "@/hooks/useAnnouncements";

export function AnnouncementModal() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    pending,
    loading,
    error,
    currentIndex,
    isFixingRecords,
    setCurrentIndex,
    handleReload,
    handleConfirm,
    handleFixOrphanedRecords,
  } = useAnnouncements();

  // Effects to handle modal visibility
  React.useEffect(() => {
    if (pending.length > 0) {
      console.log("Opening announcement modal with", pending.length, "announcements");
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [pending]);

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
                <>
                  <MenubarItem onClick={handleFixOrphanedRecords} disabled={isFixingRecords}>
                    Corrigir registros
                  </MenubarItem>
                  <MenubarItem onClick={handleGoToAnnouncements}>
                    Gerenciar Comunicados
                  </MenubarItem>
                </>
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
          <AnnouncementError
            error={error}
            isAdmin={isAdmin}
            isFixingRecords={isFixingRecords}
            onReload={handleReload}
            onFixRecords={handleFixOrphanedRecords}
          />
        )}

        {!loading && !error && pending.length === 0 && (
          <AnnouncementEmpty onReload={handleReload} />
        )}

        {!loading && !error && pending.length > 0 && pending[currentIndex]?.announcement && (
          <AnnouncementContent
            announcement={pending[currentIndex].announcement}
            currentIndex={currentIndex}
            totalAnnouncements={pending.length}
            loading={loading}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onConfirm={handleConfirm}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
