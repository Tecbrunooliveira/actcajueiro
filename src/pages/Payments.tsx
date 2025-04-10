
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

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<Record<string, Member>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "pending">("all");

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

  // Filter by status and search term
  const filteredPayments = payments
    .filter(payment => {
      if (activeTab === "paid") return payment.isPaid;
      if (activeTab === "pending") return !payment.isPaid;
      return true; // "all" tab
    })
    .filter(payment => {
      const member = members[payment.memberId];
      if (!member) return false;
      
      return member.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <MobileLayout title="Pagamentos">
      {/* Search and Add button */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar pagamento..."
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
            <PaymentsList payments={filteredPayments} members={members} />
          )}
        </TabsContent>
        <TabsContent value="paid">
          {loading ? (
            <LoadingState />
          ) : (
            <PaymentsList payments={filteredPayments} members={members} />
          )}
        </TabsContent>
        <TabsContent value="pending">
          {loading ? (
            <LoadingState />
          ) : (
            <PaymentsList payments={filteredPayments} members={members} />
          )}
        </TabsContent>
      </Tabs>
    </MobileLayout>
  );
};

interface PaymentsListProps {
  payments: Payment[];
  members: Record<string, Member>;
}

const PaymentsList = ({ payments, members }: PaymentsListProps) => {
  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum pagamento encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {payments
        .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
        .map((payment) => (
          <PaymentCard
            key={payment.id}
            payment={payment}
            memberName={members[payment.memberId]?.name}
            memberPhoto={members[payment.memberId]?.photo}
            memberPhone={members[payment.memberId]?.phone}
            onClick={() => window.location.href = `/payments/${payment.id}`}
          />
        ))}
    </div>
  );
};

const LoadingState = () => (
  <div className="text-center py-8">
    <p className="text-gray-500">Carregando pagamentos...</p>
  </div>
);

export default Payments;
