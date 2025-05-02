
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FormButtonsProps {
  isEditMode: boolean;
  submitLoading: boolean;
  navigateTo?: string;
}

export const FormButtons = ({ 
  isEditMode, 
  submitLoading,
  navigateTo = "/members" 
}: FormButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-4 pt-4">
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={() => navigate(navigateTo)}
        disabled={submitLoading}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        className="flex-1 bg-club-500 hover:bg-club-600"
        disabled={submitLoading}
      >
        {submitLoading ? "Salvando..." : isEditMode ? "Atualizar" : "Criar"}
      </Button>
    </div>
  );
};
