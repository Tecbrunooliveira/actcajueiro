
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type ExpenseFormHeaderProps = {
  isEditing: boolean;
  onCancel: () => void;
};

export function ExpenseFormHeader({ isEditing, onCancel }: ExpenseFormHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">
        {isEditing ? "Editar Despesa" : "Nova Despesa"}
      </h3>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
