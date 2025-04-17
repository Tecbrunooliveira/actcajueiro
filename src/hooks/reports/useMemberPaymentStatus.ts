
import { useState, useEffect, useCallback } from "react";
import { Member } from "@/types";
import { memberService } from "@/services";
import { useToast } from "@/components/ui/use-toast";

export const useMemberPaymentStatus = (selectedMonth: string, payments: any[]) => {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [paidMembers, setPaidMembers] = useState<Member[]>([]);
  const [unpaidMembers, setUnpaidMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    setLoadingMembers(true);
    try {
      // Add timeout handling to prevent long operations
      const fetchPromise = memberService.getAllMembers();
      const timeoutPromise = new Promise<Member[]>((_, reject) => 
        setTimeout(() => reject(new Error("Timeout fetching members")), 10000)
      );
      
      // Race the fetch against a timeout
      const fetchedMembers = await Promise.race([fetchPromise, timeoutPromise]);
      setAllMembers(fetchedMembers);
      
      // Process members in batches to avoid blocking the UI
      setTimeout(() => {
        // Filter members by payment status - do filtering client-side
        if (payments.length === 0) {
          setPaidMembers([]);
          setUnpaidMembers(fetchedMembers);
          setLoadingMembers(false);
          return;
        }

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
        
        setLoadingMembers(false);
      }, 0);
    } catch (error) {
      console.error("Error fetching members data:", error);
      toast({
        title: "Erro ao carregar membros",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
      setLoadingMembers(false);
    }
  }, [selectedMonth, payments, toast]);

  useEffect(() => {
    if (payments.length > 0) {
      fetchMembers();
    }
  }, [fetchMembers, payments]);

  return {
    allMembers,
    paidMembers,
    unpaidMembers,
    loadingMembers
  };
};
