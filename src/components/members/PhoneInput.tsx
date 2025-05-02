
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";
import { openWhatsApp } from "@/services/communicationService";
import { UseFormReturn } from "react-hook-form";
import { MemberFormValues } from "@/schemas/memberSchema";
import { ControllerRenderProps } from "react-hook-form";

interface PhoneInputProps {
  field: ControllerRenderProps<MemberFormValues, "phone">;
}

export const PhoneInput = ({ field }: PhoneInputProps) => {
  return (
    <FormItem>
      <FormLabel>Telefone</FormLabel>
      <div className="flex gap-2">
        <FormControl className="flex-1">
          <Input placeholder="(00) 00000-0000" {...field} />
        </FormControl>
        {field.value && (
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => openWhatsApp(field.value)}
          >
            <PhoneCall className="h-4 w-4" />
          </Button>
        )}
      </div>
      <FormMessage />
    </FormItem>
  );
};
