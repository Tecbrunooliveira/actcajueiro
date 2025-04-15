
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PaymentCard } from "@/components/payments/PaymentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { paymentService, memberService } from "@/services";
import { Payment, Member } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentMonthYear } from "@/services/formatters";

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<Record<string, Member>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "pending">("all");
  const { month: currentMonth } = getCurrentMonthYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get all payments
        const allPayments = await paymentService.getAllPayments();
        setPayments(allPayments);

        // Get all members and create a lookup map
        const allMembers = await memberService.getAllMembers();
        const membersMap: Record<string, Member> = {};
        allMembers.forEach(member => {
          membersMap[member.id] = member;
        });
        setMembers(membersMap);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group payments by member and get the current month's payment status
  const getMemberPaymentStatus = () => {
    const memberPaymentStatus: Record<string, { isPaid: boolean; payment: Payment | null }> = {};
    
    // Initialize with all members as not paid
    Object.keys(members).forEach(memberId => {
      memberPaymentStatus[memberId] = { isPaid: false, payment: null };
    });
    
    // Find current month's payments
    payments.forEach(payment => {
      if (payment.month === currentMonth) {
        memberPaymentStatus[payment.memberId] = { 
          isPaid: payment.isPaid, 
          payment: payment 
        };
      }
    });
    
    return memberPaymentStatus;
  };

  // Filter members by search term and payment status
  const getFilteredMembers = () => {
    const memberPaymentStatus = getMemberPaymentStatus();
    
    return Object.keys(members)
      .filter(memberId => {
        const member = members[memberId];
        const paymentStatus = memberPaymentStatus[memberId];
        
        // Filter by search term
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by payment status tab
        if (activeTab === "paid") return paymentStatus.isPaid && matchesSearch;
        if (activeTab === "pending") return !paymentStatus.isPaid && matchesSearch;
        return matchesSearch; // "all" tab
      })
      .map(memberId => ({
        member: members[memberId],
        paymentStatus: memberPaymentStatus[memberId]
      }));
  };

  const filteredMembers = getFilteredMembers();

  return (
    <MobileLayout title="Pagamentos">
      {/* Search and Add button */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar sócio..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/payments/new">
          <Button size="icon" className="bg-club-500 hover:bg-club-600">
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={(v) => setActiveTab(v as "all" | "paid" | "pending")}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="paid">Pagos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loading ? (
            <LoadingState />
          ) : (
            <MemberPaymentsList 
              filteredMembers={filteredMembers} 
              currentMonth={currentMonth}
            />
          )}
        </TabsContent>
        <TabsContent value="paid">
          {loading ? (
            <LoadingState />
          ) : (
            <MemberPaymentsList 
              filteredMembers={filteredMembers}
              currentMonth={currentMonth}
            />
          )}
        </TabsContent>
        <TabsContent value="pending">
          {loading ? (
            <LoadingState />
          ) : (
            <MemberPaymentsList 
              filteredMembers={filteredMembers}
              currentMonth={currentMonth}
            />
          )}
        </TabsContent>
      </Tabs>
    </MobileLayout>
  );
};

interface MemberPaymentsListProps {
  filteredMembers: Array<{
    member: Member;
    paymentStatus: { isPaid: boolean; payment: Payment | null };
  }>;
  currentMonth: string;
}

const MemberPaymentsList = ({ filteredMembers, currentMonth }: MemberPaymentsListProps) => {
  if (filteredMembers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum sócio encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredMembers
        .sort((a, b) => a.member.name.localeCompare(b.member.name))
        .map(({ member, paymentStatus }) => {
          // Criar um objeto de pagamento fictício se não houver um para o mês atual
          const payment = paymentStatus.payment || {
            id: `temp-${member.id}`,
            memberId: member.id,
            amount: 30,
            month: currentMonth,
            year: new Date().getFullYear(),
            isPaid: false,
            date: ""
          };
          
          return (
            <PaymentCard
              key={member.id}
              payment={payment}
              memberName={member.name}
              memberPhoto={member.photo}
              memberPhone={member.phone}
              onClick={() => {
                if (paymentStatus.payment) {
                  window.location.href = `/payments/${paymentStatus.payment.id}`;
                } else {
                  window.location.href = `/payments/new?memberId=${member.id}`;
                }
              }}
            />
          );
        })}
    </div>
  );
};

const LoadingState = () => (
  <div className="text-center py-8">
    <p className="text-gray-500">Carregando pagamentos...</p>
  </div>
);

export default Payments;
