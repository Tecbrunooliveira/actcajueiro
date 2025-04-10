
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

  getAnnualPaymentStats: async (year: number): Promise<{
    totalCollected: number;
    monthlyCollection: Record<string, number>;
    paymentCompletionRate: number;
  }> => {
    // Get all payments for the year
    const { data, error } = await paymentQueryService.supabase
      .from('payments')
      .select('*')
      .eq('year', year);
      
    if (error) {
      console.error('Error fetching annual payment data:', error);
      return {
        totalCollected: 0,
        monthlyCollection: {},
        paymentCompletionRate: 0
      };
    }
    
    // Process data to get statistics
    const paidPayments = data.filter(p => p.is_paid);
    const totalPayments = data.length;
    const totalCollected = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    
    // Group by month
    const monthlyCollection: Record<string, number> = {};
    paidPayments.forEach(payment => {
      const monthKey = payment.month;
      if (!monthlyCollection[monthKey]) {
        monthlyCollection[monthKey] = 0;
      }
      monthlyCollection[monthKey] += payment.amount;
    });
    
    // Calculate completion rate
    const paymentCompletionRate = totalPayments > 0 
      ? (paidPayments.length / totalPayments) * 100 
      : 0;
    
    return {
      totalCollected,
      monthlyCollection,
      paymentCompletionRate
    };
  }
};
