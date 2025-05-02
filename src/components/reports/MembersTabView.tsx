
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
      <TabsList className="grid grid-cols-2 mb-6 p-1 bg-muted rounded-xl overflow-hidden border border-club-100 dark:border-club-700 shadow-md">
        <TabsTrigger 
          value="unpaid" 
          className="rounded-lg py-3 font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-club-800 data-[state=active]:text-club-700 dark:data-[state=active]:text-club-300 data-[state=active]:shadow-sm transition-all duration-200"
        >
          <XCircle className="h-4 w-4 mr-2 text-club-700 dark:text-club-300" />
          Inadimplentes
        </TabsTrigger>
        <TabsTrigger 
          value="paid" 
          className="rounded-lg py-3 font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-club-800 data-[state=active]:text-club-500 dark:data-[state=active]:text-club-200 data-[state=active]:shadow-sm transition-all duration-200"
        >
          <CheckCircle className="h-4 w-4 mr-2 text-club-500 dark:text-club-200" />
          Em Dia
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="unpaid" className="space-y-4 animate-in fade-in-50 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium flex items-center text-club-800 dark:text-club-100">
            <div className="p-1.5 rounded-full bg-club-100 dark:bg-club-700 mr-2">
              <XCircle className="h-5 w-5 text-club-700 dark:text-club-300" />
            </div>
            Sócios Inadimplentes
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-club-50 dark:bg-club-800/50 text-club-700 dark:text-club-300 border-club-200 dark:border-club-700 px-3 py-1 font-medium">
              {unpaidMembers.length} sócios
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleGeneratePdfReport('unpaid')}
              disabled={generatingPdf || unpaidMembers.length === 0}
              className="bg-white dark:bg-club-800/50 hover:bg-club-50 dark:hover:bg-club-700/50 hover:text-club-700 dark:hover:text-club-300 border-club-200 dark:border-club-700 transition-colors"
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
            className="bg-gradient-to-br from-club-50 to-club-100 dark:from-club-800/30 dark:to-club-800/50 rounded-xl py-12 text-center shadow-inner"
          >
            <div className="bg-white dark:bg-club-700 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 shadow-md">
              <CheckCircle className="h-10 w-10 text-club-500 dark:text-club-200" />
            </div>
            <p className="text-club-800 dark:text-club-100 mb-2 font-medium text-lg">
              Nenhum sócio inadimplente para o período selecionado.
            </p>
            <p className="text-sm text-club-600 dark:text-club-300 max-w-xs mx-auto">
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
                    className="absolute top-3 right-3 gradient-bg hover:bg-gradient-to-r hover:from-club-600 hover:via-club-500 hover:to-club-400 rounded-full shadow-lg hover:shadow-xl w-9 h-9 p-0"
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
          <h3 className="text-lg font-medium flex items-center text-club-800 dark:text-club-100">
            <div className="p-1.5 rounded-full bg-club-100 dark:bg-club-700 mr-2">
              <CheckCircle className="h-5 w-5 text-club-500 dark:text-club-200" />
            </div>
            Sócios em Dia
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-club-50 dark:bg-club-800/50 text-club-500 dark:text-club-200 border-club-200 dark:border-club-700 px-3 py-1 font-medium">
              {paidMembers.length} sócios
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleGeneratePdfReport('paid')}
              disabled={generatingPdf || paidMembers.length === 0}
              className="bg-white dark:bg-club-800/50 hover:bg-club-50 dark:hover:bg-club-700/50 hover:text-club-500 dark:hover:text-club-200 border-club-200 dark:border-club-700 transition-colors"
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
            className="bg-gradient-to-br from-club-50 to-club-100 dark:from-club-800/30 dark:to-club-800/50 rounded-xl py-12 text-center shadow-inner"
          >
            <div className="bg-white dark:bg-club-700 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 shadow-md">
              <AlertTriangle className="h-10 w-10 text-club-400 dark:text-club-300" />
            </div>
            <p className="text-club-800 dark:text-club-100 mb-2 font-medium text-lg">
              Nenhum sócio com pagamento em dia para o período selecionado.
            </p>
            <p className="text-sm text-club-600 dark:text-club-300 max-w-xs mx-auto">
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
