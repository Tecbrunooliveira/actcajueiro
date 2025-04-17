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
import { PaymentListSkeleton } from "@/components/payments/PaymentListSkeleton";
import { motion } from "framer-motion";

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
        
        // Fetch data in parallel
        const [allPayments, allMembers] = await Promise.all([
          paymentService.getAllPayments(),
          memberService.getAllMembers()
        ]);
        
        setPayments(allPayments);

        // Create a lookup map
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

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MobileLayout title="Pagamentos">
      {/* Search and Add button */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4 flex gap-2"
      >
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
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={(v) => setActiveTab(v as "all" | "paid" | "pending")}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="paid">Pagos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
        </TabsList>

        {loading ? (
          <PaymentListSkeleton />
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum sócio encontrado</p>
              </div>
            ) : (
              filteredMembers
                .sort((a, b) => a.member.name.localeCompare(b.member.name))
                .map(({ member, paymentStatus }) => {
                  // Create a payment object if none exists for the current month
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
                    <motion.div key={member.id} variants={item}>
                      <PaymentCard
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
                    </motion.div>
                  );
                })
            )}
          </motion.div>
        )}
      </Tabs>
    </MobileLayout>
  );
};

export default Payments;
