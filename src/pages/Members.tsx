
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MemberCard } from "@/components/members/MemberCard";
import { Member, MemberStatus } from "@/types";
import { memberService } from "@/services/memberService";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Search } from "lucide-react";
import { MemberListSkeleton } from "@/components/members/MemberListSkeleton";
import { motion } from "framer-motion";

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<MemberStatus | "all">("all");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const allMembers = await memberService.getAllMembers();
        // Sort members alphabetically by name
        const sortedMembers = allMembers.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setMembers(sortedMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Filter by status and search term
  const filteredMembers = members
    .filter((member) => 
      activeTab === "all" ? true : member.status === activeTab
    )
    .filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MobileLayout title="Sócios">
      {/* Search and Add button */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4 flex gap-2"
      >
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
      </motion.div>

      {/* Tabs for filtering by status */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={(v) => setActiveTab(v as MemberStatus | "all")}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="frequentante">Frequentantes</TabsTrigger>
          <TabsTrigger value="afastado">Afastados</TabsTrigger>
        </TabsList>

        {loading ? (
          <MemberListSkeleton />
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum sócio encontrado</p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <motion.div key={member.id} variants={item}>
                  <MemberCard member={member} />
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </Tabs>
    </MobileLayout>
  );
};

export default Members;
