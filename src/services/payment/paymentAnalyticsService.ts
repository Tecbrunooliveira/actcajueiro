
import { MonthlyRecord } from "@/types";
import { memberService } from "@/services/memberService";
import { paymentQueryService } from "./paymentQueryService";

export const paymentAnalyticsService = {
  getMemberPaymentStatus: async (memberId: string): Promise<{ upToDate: boolean; unpaidMonths: string[] }> => {
    const payments = await paymentQueryService.getPaymentsByMember(memberId);
    const unpaidPayments = payments.filter(payment => !payment.isPaid);
    const unpaidMonths = unpaidPayments.map(payment => payment.month);
    
    return {
      upToDate: unpaidPayments.length === 0,
      unpaidMonths,
    };
  },

  getMonthlyRecord: async (month: string, year: number): Promise<MonthlyRecord> => {
    const payments = await paymentQueryService.getPaymentsByMonth(month, year);
    const members = await memberService.getAllMembers();
    const totalMembers = members.length;
    
    const paidMembers = new Set(
      payments.filter(p => p.isPaid).map(p => p.memberId)
    ).size;
    
    const unpaidMembers = totalMembers - paidMembers;
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const collectedAmount = payments
      .filter(p => p.isPaid)
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      month,
      year,
      totalMembers,
      paidMembers,
      unpaidMembers,
      totalAmount,
      collectedAmount,
    };
  },
};
