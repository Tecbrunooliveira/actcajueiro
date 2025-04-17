import { useState, useEffect, useCallback } from "react";
import { Member } from "@/types";
import { memberService } from "@/services";
import { useToast } from "@/components/ui/use-toast";

export const useMemberPaymentStatus = (selectedMonth: string, payments: any[]) => {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [paidMembers, setPaidMembers] = useState<Member[]>([]);
  const [unpaidMembers, setUnpaidMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    setLoadingMembers(true);
    setError(null);
    
    try {
      const fetchPromise = memberService.getAllMembers();
      const timeoutPromise = new Promise<Member[]>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar membros.")), 5000)
      );
      
      const fetchedMembers = await Promise.race([fetchPromise, timeoutPromise]);
      setAllMembers(fetchedMembers);
      
      setTimeout(() => {
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
      
      const errorMessage = error instanceof Error
        ? error.message
        : "Erro ao carregar dados dos membros. Tente novamente.";
      
      setError(errorMessage);
      
      toast({
        title: "Erro ao carregar membros",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
      
      setLoadingMembers(false);
    }
  }, [selectedMonth, payments, toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    allMembers,
    paidMembers,
    unpaidMembers,
    loadingMembers,
    error,
    retry: fetchMembers
  };
};
