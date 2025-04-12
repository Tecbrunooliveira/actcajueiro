
import { useState, useEffect } from "react";
import { Member } from "@/types";
import { memberService } from "@/services";
import { getStatusLabel } from "@/services/formatters";

export const useMemberStatusData = () => {
  const [memberStatusData, setMemberStatusData] = useState<{ name: string; value: number; color: string }[]>([]);

  const processMemberStatusData = (members: Member[]) => {
    const statusGroups: Record<string, number> = {};
    
    members.forEach(member => {
      const status = getStatusLabel(member.status);
      statusGroups[status] = (statusGroups[status] || 0) + 1;
    });
    
    const statusColors: Record<string, string> = {
      'Frequentante': '#10b981',
      'Afastado': '#f59e0b',
      'Advertido': '#ef4444',
      'Suspenso': '#f97316',
      'Licenciado': '#ecc94b'
    };
    
    const data = Object.entries(statusGroups).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name] || '#64748b'
    }));
    
    setMemberStatusData(data);
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const members = await memberService.getAllMembers();
        processMemberStatusData(members);
      } catch (error) {
        console.error("Error fetching member status data:", error);
      }
    };

    fetchMembers();
  }, []);

  return { memberStatusData };
};
