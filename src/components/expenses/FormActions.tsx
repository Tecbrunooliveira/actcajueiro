
import React from "react";
import { Button } from "@/components/ui/button";

type FormActionsProps = {
  isEditing: boolean;
  onCancel: () => void;
};

export function FormActions({ isEditing, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">
        {isEditing ? "Atualizar" : "Criar"} Despesa
      </Button>
    </div>
  );
}
