import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, User, MessageCircle } from "lucide-react";
import { openWhatsAppWithTemplate } from "@/services/communicationService";

interface MemberActionButtonsProps {
  onEdit: () => void;
  onStatus: () => void;
  onDelete: () => void;
  phone?: string;
  isUpToDate?: boolean;
}

export function MemberActionButtons({ 
  onEdit, 
  onStatus, 
  onDelete,
  phone,
  isUpToDate = true
}: MemberActionButtonsProps) {
  const handleWhatsAppClick = () => {
    if (phone) {
      // Se o membro está inadimplente, usar template de mensagem específico
      if (!isUpToDate) {
        openWhatsAppWithTemplate(phone, "payment_reminder");
      } else {
        openWhatsAppWithTemplate(phone, "general");
      }
    }
  };

  return (
    <div className="py-6">
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="flex gap-3 flex-1">
          <Button
            className="flex-1 bg-club-500 hover:bg-club-600"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onStatus}
          >
            <User className="h-4 w-4 mr-2" />
            Status
          </Button>
          {phone && (
            <Button
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          )}
        </div>
      </div>
      <div className="mt-3 flex sm:mt-0 sm:ml-3">
        <Button
          variant="destructive"
          className="w-full sm:w-auto"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
