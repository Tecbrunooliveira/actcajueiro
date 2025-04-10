
import { useState, useEffect } from "react";
import { Member } from "@/types";
import { memberService } from "@/services";

export const useMemberPaymentStatus = (selectedMonth: string, payments: any[]) => {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [paidMembers, setPaidMembers] = useState<Member[]>([]);
  const [unpaidMembers, setUnpaidMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const fetchedMembers = await memberService.getAllMembers();
        setAllMembers(fetchedMembers);
        
        // Filter members by payment status
        const monthPayments = payments.filter(
          (payment) => payment.month === selectedMonth
        );
        
        const membersPaid = fetchedMembers.filter((member) => {
          const memberPayments = monthPayments.filter(p => p.memberId === member.id);
          return memberPayments.some(p => p.isPaid);
        });
        setPaidMembers(membersPaid);
        
        const membersUnpaid = fetchedMembers.filter((member) => {
          const memberPayments = monthPayments.filter(p => p.memberId === member.id);
          return memberPayments.length === 0 || memberPayments.every(p => !p.isPaid);
        });
        setUnpaidMembers(membersUnpaid);
      } catch (error) {
        console.error("Error fetching members data:", error);
      }
    };
    
    if (payments.length > 0) {
      fetchMembers();
    }
  }, [selectedMonth, payments]);

  return {
    allMembers,
    paidMembers,
    unpaidMembers
  };
};
