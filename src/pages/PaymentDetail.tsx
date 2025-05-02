
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useParams, useNavigate } from "react-router-dom";
import { usePaymentDetail } from "@/hooks/usePaymentDetail";
import { PaymentInfoCard } from "@/components/payments/PaymentInfoCard";
import { PaymentActionButtons } from "@/components/payments/PaymentActionButtons";
import { PaymentDeleteDialog } from "@/components/payments/PaymentDeleteDialog";
import { ChevronLeft } from "lucide-react";

const PaymentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    payment,
    member,
    loading,
    actionLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    handleTogglePaid,
    handleDelete,
  } = usePaymentDetail(id);

  if (loading) {
    return (
      <MobileLayout 
        title="Detalhes do Pagamento" 
        onBackClick={() => navigate('/payments')}
      >
        <div className="flex items-center justify-center h-full py-10">
          <p>Carregando detalhes...</p>
        </div>
      </MobileLayout>
    );
  }

  if (!payment) {
    return null;
  }

  return (
    <MobileLayout 
      title="Detalhes do Pagamento" 
      onBackClick={() => navigate('/payments')}
    >
      <div className="space-y-6">
        {/* Payment information */}
        <PaymentInfoCard payment={payment} member={member} />

        {/* Action buttons */}
        <PaymentActionButtons
          payment={payment}
          member={member}
          actionLoading={actionLoading}
          onTogglePaid={handleTogglePaid}
          onShowDeleteDialog={() => setShowDeleteDialog(true)}
        />

        {/* Delete confirmation dialog */}
        <PaymentDeleteDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirmDelete={handleDelete}
          loading={actionLoading}
        />
      </div>
    </MobileLayout>
  );
};

export default PaymentDetail;
