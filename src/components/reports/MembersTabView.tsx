
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Member } from "@/types";
import { MemberCard } from "@/components/members/MemberCard";
import { CheckCircle, XCircle, Download, AlertTriangle, MessageCircle } from "lucide-react";
import { openWhatsAppWithTemplate } from "@/services/communicationService";

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

  return (
    <Tabs defaultValue="unpaid" className="mt-8">
      <TabsList className="grid grid-cols-2 mb-4 p-1 bg-muted rounded-lg">
        <TabsTrigger 
          value="unpaid" 
          className="rounded-md data-[state=active]:bg-white data-[state=active]:text-club-500 data-[state=active]:shadow-sm transition-all"
        >
          <XCircle className="h-4 w-4 mr-2 text-red-500" />
          Inadimplentes
        </TabsTrigger>
        <TabsTrigger 
          value="paid" 
          className="rounded-md data-[state=active]:bg-white data-[state=active]:text-club-500 data-[state=active]:shadow-sm transition-all"
        >
          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
          Em Dia
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="unpaid" className="space-y-4 animate-in fade-in-50 duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" />
            Sócios Inadimplentes
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200">
              {unpaidMembers.length} sócios
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleGeneratePdfReport('unpaid')}
              disabled={generatingPdf || unpaidMembers.length === 0}
              className="hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
        
        {unpaidMembers.length === 0 ? (
          <div className="bg-gray-50 rounded-lg py-12 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-gray-500 mb-2">
              Nenhum sócio inadimplente para o período selecionado.
            </p>
            <p className="text-xs text-gray-400">
              Todos os pagamentos estão em dia!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {unpaidMembers.map((member) => (
              <div key={member.id} className="relative">
                <MemberCard member={member} />
                {member.phone && (
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 bg-club-500 hover:bg-club-600"
                    onClick={() => handleWhatsAppClick(member.phone!)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="paid" className="space-y-4 animate-in fade-in-50 duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Sócios em Dia
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-500 border-green-200">
              {paidMembers.length} sócios
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleGeneratePdfReport('paid')}
              disabled={generatingPdf || paidMembers.length === 0}
              className="hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
        
        {paidMembers.length === 0 ? (
          <div className="bg-gray-50 rounded-lg py-12 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-gray-500 mb-2">
              Nenhum sócio com pagamento em dia para o período selecionado.
            </p>
            <p className="text-xs text-gray-400">
              Utilize o botão "Gerar Pagamentos Pendentes" acima.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paidMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
