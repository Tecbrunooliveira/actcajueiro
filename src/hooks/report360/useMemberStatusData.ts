
import { useState, useEffect, useCallback } from "react";
import { Member } from "@/types";
import { memberService } from "@/services";
import { getStatusLabel } from "@/services/formatters";

export const useMemberStatusData = () => {
  const [memberStatusData, setMemberStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const processMemberStatusData = useCallback((members: Member[]) => {
    // Early exit for empty data
    if (!members || members.length === 0) {
      setMemberStatusData([
        { name: 'Sem dados', value: 1, color: '#64748b' }
      ]);
      return;
    }
    
    const statusGroups: Record<string, number> = {};
    
    members.forEach(member => {
      try {
        const status = getStatusLabel(member.status);
        statusGroups[status] = (statusGroups[status] || 0) + 1;
      } catch (e) {
        // Skip invalid status
        console.warn("Invalid member status:", member.status);
      }
    });
    
    const statusColors: Record<string, string> = {
      'Frequentante': '#10b981',
      'Afastado': '#f59e0b',
      'Sem dados': '#64748b'
    };
    
    // If we have no status groups, add a default
    if (Object.keys(statusGroups).length === 0) {
      statusGroups['Sem dados'] = 1;
    }
    
    const data = Object.entries(statusGroups).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name] || '#64748b'
    }));
    
    setMemberStatusData(data);
  }, []);

  const fetchMembers = useCallback(async () => {
    try {
      // Cancel any ongoing request
      if (abortController) {
        abortController.abort();
      }
      
      // Create a new abort controller
      const controller = new AbortController();
      setAbortController(controller);
      
      setError(null);
      setFetchAttempted(true);
      
      // Add timeout for better error handling
      const fetchPromise = memberService.getAllMembers();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Erro de tempo limite ao carregar dados de membros.")), 8000)
      );
      
      // Race the fetch against a timeout
      const members = await Promise.race([fetchPromise, timeoutPromise]);
      
      // Process the data
      processMemberStatusData(members);
      
      // Clear the abort controller
      setAbortController(null);
    } catch (error) {
      console.error("Error fetching member status data:", error);
      
      // Only set error if this wasn't an aborted request
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        // Set more specific error messages
        if (error instanceof Error) {
          if (error.message.includes("tempo limite") || error.message.includes("timeout")) {
            setError("Erro de tempo limite ao carregar dados de membros.");
          } else if (error.message.includes("statement timeout")) {
            setError("O servidor está sobrecarregado. Tente novamente mais tarde.");
          } else {
            setError(error.message);
          }
        } else {
          setError("Erro ao carregar dados de membros");
        }
        
        // Set default data for better fallback experience
        if (memberStatusData.length === 0) {
          setMemberStatusData([
            { name: 'Frequentante', value: 0, color: '#10b981' },
            { name: 'Afastado', value: 0, color: '#f59e0b' }
          ]);
        }
      }
      
      // Clear the abort controller
      setAbortController(null);
    }
  }, [processMemberStatusData, abortController, memberStatusData.length]);

  useEffect(() => {
    // Only fetch if we haven't tried yet
    if (!fetchAttempted) {
      fetchMembers();
    }
    
    // Cleanup function to abort fetch on unmount
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [fetchMembers, fetchAttempted, abortController]);

  return { 
    memberStatusData,
    error,
    retry: fetchMembers
  };
};
