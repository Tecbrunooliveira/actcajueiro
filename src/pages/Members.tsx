import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { memberService } from "@/services/memberService";
import { Member } from "@/types";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberCard } from "@/components/members/MemberCard";
import { PlusCircle, Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MemberListSkeleton } from "@/components/members/MemberListSkeleton";
import { useAuth } from "@/contexts/auth";

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, members, activeTab]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await memberService.getAllMembers();
      setMembers(data);
    } catch (error) {
      console.error("Error loading members:", error);
      toast.error("Erro ao carregar sócios");
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let result = members;

    // Filter by status
    if (activeTab !== "all") {
      result = result.filter((member) => member.status === activeTab);
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(term) ||
          (member.email && member.email.toLowerCase().includes(term))
      );
    }

    setFilteredMembers(result);
  };

  const handleNewMember = () => {
    navigate("/members/new");
  };

  const handleAdminUsersPage = () => {
    navigate("/admin/users");
  };

  return (
    <MobileLayout title="Sócios">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Buscar sócio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleNewMember} 
            className="bg-club-500 hover:bg-club-600"
          >
            <PlusCircle className="w-5 h-5" />
          </Button>
          
          {isAdmin && (
            <Button 
              onClick={handleAdminUsersPage} 
              className="bg-indigo-500 hover:bg-indigo-600"
              title="Gerenciar usuários do sistema"
            >
              <UserPlus className="w-5 h-5" />
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="inactive">Inativos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <MemberListSkeleton />
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                isAdmin ? (
                  <MemberCard key={member.id} member={member} />
                ) : (
                  <div key={member.id} className="pointer-events-none opacity-80">
                    <MemberCard member={member} />
                  </div>
                )
              ))
            ) : (
              <div className="text-center py-10">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  Nenhum sócio encontrado
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Tente outro termo de busca"
                    : "Comece adicionando um novo sócio"}
                </p>
                <div className="mt-6">
                  <Button
                    onClick={handleNewMember}
                    className="bg-club-500 hover:bg-club-600"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Sócio
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Members;
