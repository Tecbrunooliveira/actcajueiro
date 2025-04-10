
import React, { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PaymentCard } from "@/components/payments/PaymentCard";
import { Payment } from "@/types";
import { memberService, paymentService } from "@/services/dataService";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search } from "lucide-react";

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "unpaid">("all");
  const allPayments = paymentService.getAllPayments();
  const allMembers = memberService.getAllMembers();

  // Get member name by ID
  const getMemberName = (memberId: string) => {
    const member = allMembers.find((m) => m.id === memberId);
    return member ? member.name : "Desconhecido";
  };

  // Filter by payment status and search term
  const filteredPayments = allPayments
    .filter((payment) => {
      if (activeTab === "all") return true;
      if (activeTab === "paid") return payment.isPaid;
      if (activeTab === "unpaid") return !payment.isPaid;
      return true;
    })
    .filter((payment) => {
      const memberName = getMemberName(payment.memberId).toLowerCase();
      return memberName.includes(searchTerm.toLowerCase());
    });

  // Sort payments by date (most recent first)
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    return new Date(b.month).getTime() - new Date(a.month).getTime();
  });

  return (
    <MobileLayout title="Pagamentos">
      {/* Search and Add button */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar por sócio..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/payments/new">
          <Button size="icon" className="bg-club-500 hover:bg-club-600">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Tabs for filtering by payment status */}
      <Tabs
        defaultValue="all"
        className="mb-6"
        onValueChange={(v) => setActiveTab(v as "all" | "paid" | "unpaid")}
      >
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="paid">Pagos</TabsTrigger>
          <TabsTrigger value="unpaid">Pendentes</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <PaymentsList payments={sortedPayments} getMemberName={getMemberName} />
        </TabsContent>
        <TabsContent value="paid">
          <PaymentsList payments={sortedPayments} getMemberName={getMemberName} />
        </TabsContent>
        <TabsContent value="unpaid">
          <PaymentsList payments={sortedPayments} getMemberName={getMemberName} />
        </TabsContent>
      </Tabs>
    </MobileLayout>
  );
};

interface PaymentsListProps {
  payments: Payment[];
  getMemberName: (memberId: string) => string;
}

const PaymentsList = ({ payments, getMemberName }: PaymentsListProps) => {
  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum pagamento encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <Link key={payment.id} to={`/payments/${payment.id}`}>
          <PaymentCard
            payment={payment}
            memberName={getMemberName(payment.memberId)}
          />
        </Link>
      ))}
    </div>
  );
};

export default Payments;
