
import { useState, useEffect, useCallback } from "react";
import { Member, Payment } from "@/types";
import { memberService } from "@/services";

export const useMemberPaymentStatus = (month: string, payments: Payment[]) => {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [paidMembers, setPaidMembers] = useState<Member[]>([]);
  const [unpaidMembers, setUnpaidMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!month || !payments.length || !allMembers.length) return;

    // IDs dos sócios que pagaram no mês
    const paidMemberIds = payments
      .filter(payment => payment.month === month && payment.isPaid)
      .map(payment => payment.memberId);

    // Sócios "frequentante" ou "afastado" que PAGARAM
    const paid = allMembers.filter(member =>
      paidMemberIds.includes(member.id) &&
      (member.status === "frequentante" || member.status === "afastado")
    );

    // Sócios "frequentante" ou "afastado" que NÃO PAGARAM
    const unpaid = allMembers.filter(member =>
      !paidMemberIds.includes(member.id) &&
      (member.status === "frequentante" || member.status === "afastado")
    );

    setPaidMembers(paid);
    setUnpaidMembers(unpaid);
  }, [month, payments, allMembers]);

  // Load all members when payments change
  const loadMembers = useCallback(async () => {
    if (!payments.length) return;

    try {
      setLoading(true);
      setError(null);

      const members = await memberService.getAllMembers();
      setAllMembers(members);
    } catch (err) {
      console.error("Error loading members:", err);
      setError("Erro ao carregar dados dos sócios.");
    } finally {
      setLoading(false);
    }
  }, [payments]);

  // Load members when payments change or retry is triggered
  useEffect(() => {
    if (payments.length > 0) {
      loadMembers();
    }
  }, [loadMembers, retryCount, payments]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return {
    allMembers,
    paidMembers,
    unpaidMembers,
    loadingMembers: loading,
    error,
    retry
  };
};
