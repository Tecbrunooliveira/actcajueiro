
import { Payment } from "@/types";

export const paymentMetricsService = {
  calculatePaymentStatusMetrics(payments: Payment[], memberId?: string) {
    if (memberId) {
      // Filter by member if memberId is provided
      payments = payments.filter(p => p.memberId === memberId);
    }
    
    // Get unique member IDs
    const memberIds = [...new Set(payments.map(p => p.memberId))];
    
    // Count paid vs unpaid members
    const paidMemberIds = new Set(
      payments
        .filter(p => p.isPaid)
        .map(p => p.memberId)
    );
    
    const paidMembers = paidMemberIds.size;
    const unpaidMembers = memberIds.length - paidMembers;
    
    return [
      { name: 'Em Dia', value: paidMembers, color: '#10b981' },
      { name: 'Inadimplentes', value: unpaidMembers, color: '#ef4444' }
    ];
  }
};
