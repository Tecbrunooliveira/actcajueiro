import React, { useEffect, useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { memberService, paymentService } from "@/services";
import { MonthlyRecord, Payment } from "@/types";
import { getCurrentMonthYear } from "@/services/formatters";
import { motion } from "framer-motion";
import { WelcomeCard } from "@/components/home/WelcomeCard";
import { StatsSummary } from "@/components/home/StatsSummary";
import { PaymentAlerts } from "@/components/home/PaymentAlerts";
import { QuickActions } from "@/components/home/QuickActions";
import { NavigationLinks } from "@/components/home/NavigationLinks";
import { HomeLoading } from "@/components/home/HomeLoading";
import { useAuth } from "@/contexts/auth";
import { Link } from "react-router-dom";
import { UserPlus, Bell } from "lucide-react";
import { AnnouncementModal } from "@/components/announcements/AnnouncementModal";

const Index = () => {
  const { user, isAdmin } = useAuth();
  const [members, setMembers] = useState([]);
  const [unpaidPayments, setUnpaidPayments] = useState<Payment[]>([]);
  const [monthlyRecord, setMonthlyRecord] = useState<MonthlyRecord>({
    month: "",
    year: 0,
    totalMembers: 0,
    paidMembers: 0,
    unpaidMembers: 0,
    totalAmount: 0,
    collectedAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const currentMonth = getCurrentMonthYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedMembers, fetchedUnpaidPayments, fetchedMonthlyRecord] = await Promise.all([
          memberService.getAllMembers(),
          paymentService.getUnpaidPayments(),
          paymentService.getMonthlyRecord(currentMonth.month, currentMonth.year)
        ]);

        setMembers(fetchedMembers);
        setUnpaidPayments(fetchedUnpaidPayments);
        setMonthlyRecord(fetchedMonthlyRecord);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <MobileLayout title="ASSOCIAÇÃO ACT - CAJUEIRO">
      <AnnouncementModal />
      {loading ? <HomeLoading /> : (
        <motion.div 
          className="space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <WelcomeCard />
          <StatsSummary membersCount={members.length} monthlyRecord={monthlyRecord} />
          <PaymentAlerts unpaidPayments={unpaidPayments} />
          {isAdmin && <QuickActions />}
          {isAdmin && <NavigationLinks />}
          {isAdmin && (
            <div className="mt-6">
              <h2 className="font-semibold text-gray-700 mb-3">Administração</h2>
              <div className="grid grid-cols-1 gap-3">
                <Link
                  to="/admin/users"
                  className="flex items-center p-3 rounded-lg border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <div className="rounded-md bg-indigo-500 p-2 mr-3">
                    <UserPlus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Gerenciar Usuários</h3>
                    <p className="text-sm text-gray-500">Criar e associar usuários a sócios</p>
                  </div>
                </Link>
                <Link
                  to="/admin/announcements"
                  className="flex items-center p-3 rounded-lg border border-amber-100 bg-amber-50 hover:bg-amber-100 transition-colors"
                >
                  <div className="rounded-md bg-amber-500 p-2 mr-3">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Central de Comunicados</h3>
                    <p className="text-sm text-gray-500">
                      Envie comunicados para os sócios
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </MobileLayout>
  );
};

export default Index;
