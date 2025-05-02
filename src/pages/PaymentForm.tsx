
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useParams } from "react-router-dom";
import { PaymentFormComponent } from "@/components/payments/PaymentFormComponent";
import { usePaymentForm } from "@/hooks/usePaymentForm";

const PaymentForm = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    form, 
    members, 
    loading, 
    isEditMode, 
    submitLoading, 
    onSubmit, 
    watchIsPaid 
  } = usePaymentForm(id);

  if (loading) {
    return (
      <MobileLayout title={isEditMode ? "Editar Pagamento" : "Novo Pagamento"}>
        <div className="flex items-center justify-center h-full py-10">
          <p>Carregando dados...</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      title={isEditMode ? "Editar Pagamento" : "Novo Pagamento"}
    >
      <PaymentFormComponent 
        form={form}
        members={members}
        onSubmit={onSubmit}
        isEditMode={isEditMode}
        submitLoading={submitLoading}
        watchIsPaid={watchIsPaid}
      />
    </MobileLayout>
  );
};

export default PaymentForm;
