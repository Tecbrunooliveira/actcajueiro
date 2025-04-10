
import React, { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MemberCard } from "@/components/members/MemberCard";
import { Member, MemberStatus } from "@/types";
import { memberService } from "@/services/dataService";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Search } from "lucide-react";

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<MemberStatus | "all">("all");
  const allMembers = memberService.getAllMembers();

  // Filter by status and search term
  const filteredMembers = allMembers
    .filter((member) => 
      activeTab === "all" ? true : member.status === activeTab
    )
    .filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <MobileLayout title="Sócios">
      {/* Search and Add button */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar sócio..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/members/new">
          <Button size="icon" className="bg-club-500 hover:bg-club-600">
            <UserPlus className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Tabs for filtering by status */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={(v) => setActiveTab(v as MemberStatus | "all")}>
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="frequentante">Frequentantes</TabsTrigger>
          <TabsTrigger value="afastado">Afastados</TabsTrigger>
          <TabsTrigger value="advertido">Advertidos</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <MembersList members={filteredMembers} />
        </TabsContent>
        <TabsContent value="frequentante">
          <MembersList members={filteredMembers} />
        </TabsContent>
        <TabsContent value="afastado">
          <MembersList members={filteredMembers} />
        </TabsContent>
        <TabsContent value="advertido">
          <MembersList members={filteredMembers} />
        </TabsContent>
      </Tabs>
    </MobileLayout>
  );
};

interface MembersListProps {
  members: Member[];
}

const MembersList = ({ members }: MembersListProps) => {
  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum sócio encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
};

export default Members;
