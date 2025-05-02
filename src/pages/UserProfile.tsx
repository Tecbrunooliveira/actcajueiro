
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { memberService, paymentService, announcementService } from "@/services";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MemberInfoCard } from "@/components/members/MemberInfoCard";
import { PaymentsList } from "@/components/members/PaymentsList";
import { AlertCircle, Info, Bell, Database, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AnnouncementModal } from "@/components/announcements/AnnouncementModal";

const UserProfile = () => {
  const { user, isAdmin } = useAuth();
  const [member, setMember] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [hasAnnouncements, setHasAnnouncements] = useState(false);
  const [announcementsError, setAnnouncementsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cleaningUpRecords, setCleaningUpRecords] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        // Find the member with user_id = user.id
        const allMembers = await memberService.getAllMembers();
        const myMember = allMembers.find(m => m.user_id === user?.id);
        setMember(myMember || null);
        if (myMember) {
          const history = await paymentService.getPaymentsByMember(myMember.id);
          setPayments(history);
          
          // Check for announcements
          await checkForAnnouncements();
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar os dados do seu perfil. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) loadProfile();
  }, [user, toast]);

  const checkForAnnouncements = async () => {
    try {
      console.log("Checking for announcements from UserProfile");
      const announcements = await announcementService.getMyAnnouncements();
      setHasAnnouncements(announcements && announcements.length > 0);
      
      if (announcements && announcements.length > 0) {
        console.log("Found announcements for user:", announcements.length);
        // Set a visual indicator for announcements
        setHasAnnouncements(true);
        // Reset any previous errors
        setAnnouncementsError(null);
      } else {
        console.log("No announcements found for this user from UserProfile component");
        setHasAnnouncements(false);
        setAnnouncementsError(null);
      }
    } catch (err) {
      console.error("Error checking announcements from UserProfile:", err);
      setAnnouncementsError("Erro ao carregar comunicados. Por favor, tente novamente mais tarde.");
      setHasAnnouncements(false);
    }
  }

  const triggerAnnouncementModal = () => {
    // Force open the modal dialog
    const modal = document.querySelector("[role='dialog']");
    if (modal) {
      (modal as HTMLElement).click();
    }
  };

  const handleCleanupRecords = async () => {
    setCleaningUpRecords(true);
    try {
      // Call new cleanup method to fix orphaned records
      if (announcementService.announcementQueryService) {
        await announcementService.announcementQueryService.cleanupOrphanedRecipients();
        toast({
          title: "Registros corrigidos",
          description: "Os registros de comunicados foram corrigidos com sucesso.",
          variant: "default",
        });
      } else {
        // Fallback if the service isn't available directly
        toast({
          title: "Operação não disponível",
          description: "A limpeza de registros não está disponível neste momento.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cleaning up records:", error);
      toast({
        title: "Erro",
        description: "Não foi possível corrigir os registros. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setCleaningUpRecords(false);
      // Recheck announcements after cleanup
      checkForAnnouncements();
    }
  };

  const handleRefreshAnnouncements = async () => {
    setLoading(true);
    try {
      await checkForAnnouncements();
      toast({
        title: "Comunicados atualizados",
        description: "A lista de comunicados foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Error refreshing announcements:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os comunicados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout title="Meu Perfil">
        <div className="flex justify-center py-12 text-gray-500">Carregando...</div>
      </MobileLayout>
    );
  }

  if (!member) {
    return (
      <MobileLayout title="Meu Perfil">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="h-12 w-12 text-amber-500" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-amber-600 mb-2">Perfil não encontrado</h2>
            <p className="text-gray-600 mb-4">
              Sua conta de usuário ({user?.email}) não está associada a nenhum sócio.
              Entre em contato com um administrador para associar sua conta.
            </p>
          </div>
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="flex items-center"
            >
              <Info className="mr-2 h-4 w-4" />
              Página Inicial
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Meu Perfil">
      {/* This will automatically show if there are announcements */}
      <AnnouncementModal />
      
      {announcementsError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
          <div className="flex-grow">
            <p className="font-medium">Erro ao carregar comunicados</p>
            <p className="text-sm text-gray-600">{announcementsError}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto bg-red-100 hover:bg-red-200 border-red-200"
              onClick={handleRefreshAnnouncements}
              disabled={loading}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto bg-amber-100 hover:bg-amber-200 border-amber-200"
                onClick={handleCleanupRecords}
                disabled={cleaningUpRecords}
              >
                <Database className="h-4 w-4 mr-2" />
                Corrigir registros
              </Button>
            )}
          </div>
        </div>
      )}
      
      {hasAnnouncements && !announcementsError && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center">
          <Bell className="h-5 w-5 text-amber-500 mr-2 animate-bounce flex-shrink-0" />
          <div className="flex-grow">
            <p className="font-medium">Você tem comunicados não lidos</p>
            <p className="text-sm text-gray-600">Clique no botão para visualizá-los</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto bg-amber-100 hover:bg-amber-200 border-amber-200"
            onClick={triggerAnnouncementModal}
          >
            <Bell className="h-4 w-4 mr-2" />
            Ver comunicados
          </Button>
        </div>
      )}
      
      <MemberInfoCard member={member} />
      <div className="mt-6">
        <PaymentsList 
          payments={payments} 
          memberId={member.id} 
          memberName={member.name} 
          memberPhoto={member.photo}
          isAdmin={isAdmin}
        />
      </div>
    </MobileLayout>
  );
};

export default UserProfile;
