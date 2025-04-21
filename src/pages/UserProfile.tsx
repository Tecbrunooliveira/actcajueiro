
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { memberService, paymentService } from "@/services";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MemberInfoCard } from "@/components/members/MemberInfoCard";
import { PaymentsList } from "@/components/members/PaymentsList";
import { AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { user } = useAuth();
  const [member, setMember] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
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
      <MemberInfoCard member={member} />
      <div className="mt-6">
        <PaymentsList payments={payments} memberId={member.id} memberName={member.name} memberPhoto={member.photo} />
      </div>
    </MobileLayout>
  );
};

export default UserProfile;
