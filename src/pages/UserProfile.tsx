
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { memberService, paymentService, announcementService } from "@/services";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MemberInfoCard } from "@/components/members/MemberInfoCard";
import { PaymentsList } from "@/components/members/PaymentsList";
import { AlertCircle, Info, Bell, Database } from "lucide-react";
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
          try {
            const announcements = await announcementService.getMyAnnouncements();
            setHasAnnouncements(announcements && announcements.length > 0);
            
            if (announcements && announcements.length > 0) {
              console.log("Found announcements for user:", announcements.length);
            } else {
              console.log("No announcements found for this user");
              
              // Reset any previous errors
              setAnnouncementsError(null);
            }
          } catch (err) {
            console.error("Error checking announcements:", err);
            setAnnouncementsError("Erro ao carregar comunicados. Por favor, tente novamente mais tarde.");
          }
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

  const triggerAnnouncementModal = () => {
    const modal = document.querySelector("[role='dialog']");
    if (modal) {
      (modal as HTMLElement).click();
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
      <AnnouncementModal />
      
      {announcementsError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <div>
            <p className="font-medium">Erro ao carregar comunicados</p>
            <p className="text-sm text-gray-600">{announcementsError}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto bg-red-100 hover:bg-red-200 border-red-200"
            onClick={triggerAnnouncementModal}
          >
            <Database className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      )}
      
      {hasAnnouncements && !announcementsError && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center">
          <Bell className="h-5 w-5 text-amber-500 mr-2 animate-bounce" />
          <div>
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
