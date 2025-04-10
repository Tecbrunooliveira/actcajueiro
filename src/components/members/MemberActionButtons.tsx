
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, User } from "lucide-react";

interface MemberActionButtonsProps {
  onEdit: () => void;
  onStatus: () => void;
  onDelete: () => void;
}

export function MemberActionButtons({ 
  onEdit, 
  onStatus, 
  onDelete 
}: MemberActionButtonsProps) {
  return (
    <div className="flex gap-3 py-6">
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
      
      <Button
        variant="destructive"
        size="icon"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
