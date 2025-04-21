
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { memberService, paymentService } from "@/services";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MemberInfoCard } from "@/components/members/MemberInfoCard";
import { PaymentsList } from "@/components/members/PaymentsList";
import { AlertCircle } from "lucide-react";

const UserProfile = () => {
  const { user } = useAuth();
  const [member, setMember] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      // Find the member with user_id = user.id
      const allMembers = await memberService.getAllMembers();
      const myMember = allMembers.find(m => m.user_id === user?.id);
      setMember(myMember || null);
      if (myMember) {
        const history = await paymentService.getPaymentsByMember(myMember.id);
        setPayments(history);
      }
      setLoading(false);
    }
    if (user?.id) loadProfile();
  }, [user]);

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
        <div className="flex flex-col items-center justify-center py-12 space-y-2">
          <AlertCircle className="h-8 w-8 text-amber-500" />
          <div className="text-center text-amber-600">Nenhum perfil encontrado para seu usuário.</div>
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
