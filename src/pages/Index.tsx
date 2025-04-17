
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

const Index = () => {
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

  if (loading) {
    return (
      <MobileLayout title="ASSOCIAÇÃO ACT - CAJUEIRO">
        <HomeLoading />
      </MobileLayout>
    );
  }

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
      <motion.div 
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <WelcomeCard />
        <StatsSummary membersCount={members.length} monthlyRecord={monthlyRecord} />
        <PaymentAlerts unpaidPayments={unpaidPayments} />
        <QuickActions />
        <NavigationLinks />
      </motion.div>
    </MobileLayout>
  );
};

export default Index;
