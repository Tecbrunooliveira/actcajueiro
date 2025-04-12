
import React from "react";
import {
  Form,
} from "@/components/ui/form";
import { MemberFormValues } from "@/schemas/memberSchema";
import { UseFormReturn } from "react-hook-form";
import { PhotoUpload } from "./PhotoUpload";
import { BasicInfoFields } from "./BasicInfoFields";
import { WarningsSection } from "./WarningsSection";
import { FormButtons } from "./FormButtons";

interface MemberFormComponentProps {
  form: UseFormReturn<MemberFormValues>;
  onSubmit: (data: MemberFormValues) => Promise<void>;
  isEditMode: boolean;
  submitLoading: boolean;
}

export const MemberFormComponent = ({
  form,
  onSubmit,
  isEditMode,
  submitLoading,
}: MemberFormComponentProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo Upload Section */}
        <FormPhotoUpload form={form} />
        
        {/* Basic Information Fields */}
        <BasicInfoFields form={form} />
        
        {/* Warnings Section */}
        <WarningsSection form={form} />
        
        {/* Form Buttons */}
        <FormButtons 
          isEditMode={isEditMode} 
          submitLoading={submitLoading} 
        />
      </form>
    </Form>
  );
};

// Small inline component since it's very specific and simple
const FormPhotoUpload = ({ form }: { form: UseFormReturn<MemberFormValues> }) => (
  <div className="form-control">
    {form.control && (
      <div className="pb-2">
        <PhotoUpload
          value={form.watch("photo") || ""}
          onChange={(value) => form.setValue("photo", value)}
        />
      </div>
    )}
  </div>
);
