
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Member } from "@/types";
import { MemberCard } from "@/components/members/MemberCard";
import { CheckCircle, XCircle, Download, AlertTriangle, MessageCircle } from "lucide-react";
import { openWhatsAppWithTemplate } from "@/services/communicationService";
import { motion } from "framer-motion";

interface MembersTabViewProps {
  paidMembers: Member[];
  unpaidMembers: Member[];
  handleGeneratePdfReport: (type: 'paid' | 'unpaid') => void;
  generatingPdf: boolean;
}

export const MembersTabView: React.FC<MembersTabViewProps> = ({
  paidMembers,
  unpaidMembers,
  handleGeneratePdfReport,
  generatingPdf,
}) => {
  const handleWhatsAppClick = (phone: string) => {
    if (phone) {
      openWhatsAppWithTemplate(phone, "payment_reminder");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Tabs defaultValue="unpaid" className="mt-8">
      <TabsList className="grid grid-cols-2 mb-6 p-1 bg-muted rounded-xl overflow-hidden border border-gray-100">
        <TabsTrigger 
          value="unpaid" 
          className="rounded-lg py-2.5 font-medium data-[state=active]:bg-white data-[state=active]:text-red-500 data-[state=active]:shadow-sm transition-all duration-200"
        >
          <XCircle className="h-4 w-4 mr-2 text-red-500" />
          Inadimplentes
        </TabsTrigger>
        <TabsTrigger 
          value="paid" 
          className="rounded-lg py-2.5 font-medium data-[state=active]:bg-white data-[state=active]:text-green-500 data-[state=active]:shadow-sm transition-all duration-200"
        >
          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
          Em Dia
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="unpaid" className="space-y-4 animate-in fade-in-50 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium flex items-center">
            <div className="p-1.5 rounded-full bg-red-100 mr-2">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            Sócios Inadimplentes
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200 px-3 py-1 font-medium">
              {unpaidMembers.length} sócios
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleGeneratePdfReport('unpaid')}
              disabled={generatingPdf || unpaidMembers.length === 0}
              className="bg-white hover:bg-red-50 hover:text-red-600 border-red-200 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
        
        {unpaidMembers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl py-12 text-center shadow-inner"
          >
            <div className="bg-white rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 shadow-md">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <p className="text-gray-700 mb-2 font-medium text-lg">
              Nenhum sócio inadimplente para o período selecionado.
            </p>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Todos os pagamentos estão em dia! Continue mantendo o bom trabalho.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {unpaidMembers.map((member) => (
              <motion.div key={member.id} className="relative" variants={item}>
                <MemberCard member={member} />
                {member.phone && (
                  <Button
                    size="sm"
                    className="absolute top-3 right-3 bg-gradient-to-r from-club-500 to-club-600 hover:from-club-600 hover:to-club-700 rounded-full shadow-lg hover:shadow-xl w-9 h-9 p-0"
                    onClick={() => handleWhatsAppClick(member.phone!)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </TabsContent>
      
      <TabsContent value="paid" className="space-y-4 animate-in fade-in-50 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium flex items-center">
            <div className="p-1.5 rounded-full bg-green-100 mr-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            Sócios em Dia
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-500 border-green-200 px-3 py-1 font-medium">
              {paidMembers.length} sócios
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleGeneratePdfReport('paid')}
              disabled={generatingPdf || paidMembers.length === 0}
              className="bg-white hover:bg-green-50 hover:text-green-600 border-green-200 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
        
        {paidMembers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl py-12 text-center shadow-inner"
          >
            <div className="bg-white rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 shadow-md">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
            </div>
            <p className="text-gray-700 mb-2 font-medium text-lg">
              Nenhum sócio com pagamento em dia para o período selecionado.
            </p>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Utilize o botão "Gerar Pagamentos Pendentes" acima para criar os registros.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {paidMembers.map((member) => (
              <motion.div key={member.id} variants={item}>
                <MemberCard key={member.id} member={member} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </TabsContent>
    </Tabs>
  );
};
