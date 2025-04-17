
import { useState, useEffect, useCallback } from "react";
import { Member } from "@/types";
import { memberService } from "@/services";
import { getStatusLabel } from "@/services/formatters";

export const useMemberStatusData = () => {
  const [memberStatusData, setMemberStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const processMemberStatusData = useCallback((members: Member[]) => {
    const statusGroups: Record<string, number> = {};
    
    members.forEach(member => {
      const status = getStatusLabel(member.status);
      statusGroups[status] = (statusGroups[status] || 0) + 1;
    });
    
    const statusColors: Record<string, string> = {
      'Frequentante': '#10b981',
      'Afastado': '#f59e0b'
    };
    
    const data = Object.entries(statusGroups).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name] || '#64748b'
    }));
    
    setMemberStatusData(data);
  }, []);

  const fetchMembers = useCallback(async () => {
    try {
      setError(null);
      
      // Add timeout for better error handling
      const fetchPromise = memberService.getAllMembers();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar dados de membros.")), 5000)
      );
      
      // Race the fetch against a timeout
      const members = await Promise.race([fetchPromise, timeoutPromise]);
      
      processMemberStatusData(members);
    } catch (error) {
      console.error("Error fetching member status data:", error);
      setError(error instanceof Error ? error.message : "Erro ao carregar dados de membros");
      
      // Set empty data to avoid undefined errors
      setMemberStatusData([]);
    }
  }, [processMemberStatusData]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { 
    memberStatusData,
    error,
    retry: fetchMembers
  };
};
