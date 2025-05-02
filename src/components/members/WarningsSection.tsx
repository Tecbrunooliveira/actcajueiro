
import React from "react";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { MemberFormValues } from "@/schemas/memberSchema";

interface WarningsSectionProps {
  form: UseFormReturn<MemberFormValues>;
}

export const WarningsSection = ({ form }: WarningsSectionProps) => {
  const warnings = form.watch("warnings") || [];
  
  const addWarning = () => {
    const currentWarnings = form.getValues("warnings") || [];
    form.setValue("warnings", [
      ...currentWarnings, 
      { text: "", date: new Date().toISOString().split("T")[0] }
    ]);
  };
  
  const removeWarning = (index: number) => {
    const currentWarnings = [...(form.getValues("warnings") || [])];
    currentWarnings.splice(index, 1);
    form.setValue("warnings", currentWarnings);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <FormLabel>Advertências</FormLabel>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={addWarning}
          className="flex items-center text-sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar
        </Button>
      </div>
      
      {warnings.map((warning, index) => (
        <div key={index} className="flex gap-2 items-start border p-3 rounded-md bg-gray-50">
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Input
                  placeholder="Descrição da advertência"
                  value={warning.text}
                  onChange={(e) => {
                    const newWarnings = [...warnings];
                    newWarnings[index].text = e.target.value;
                    form.setValue("warnings", newWarnings);
                  }}
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={warning.date}
                  onChange={(e) => {
                    const newWarnings = [...warnings];
                    newWarnings[index].date = e.target.value;
                    form.setValue("warnings", newWarnings);
                  }}
                />
              </div>
            </div>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => removeWarning(index)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
