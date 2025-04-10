
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useParams } from "react-router-dom";
import { MemberFormComponent } from "@/components/members/MemberFormComponent";
import { useMemberForm } from "@/hooks/useMemberForm";

const MemberForm = () => {
  const { id } = useParams<{ id: string }>();
  const { form, loading, isEditMode, submitLoading, onSubmit } = useMemberForm(id);

  if (loading) {
    return (
      <MobileLayout title={isEditMode ? "Editar Sócio" : "Novo Sócio"}>
        <div className="flex items-center justify-center h-full py-10">
          <p>Carregando dados...</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      title={isEditMode ? "Editar Sócio" : "Novo Sócio"}
    >
      <MemberFormComponent 
        form={form}
        onSubmit={onSubmit}
        isEditMode={isEditMode}
        submitLoading={submitLoading}
      />
    </MobileLayout>
  );
};

export default MemberForm;
