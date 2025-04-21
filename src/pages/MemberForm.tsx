
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useParams } from "react-router-dom";
import { MemberFormComponent } from "@/components/members/MemberFormComponent";

const MemberForm = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <MobileLayout
      title={id ? "Editar Sócio" : "Novo Sócio"}
    >
      <MemberFormComponent memberId={id} />
    </MobileLayout>
  );
};

export default MemberForm;
