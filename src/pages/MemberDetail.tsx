
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useMemberDetail } from "@/hooks/useMemberDetail";
import { MemberInfoCard } from "@/components/members/MemberInfoCard";
import { PaymentStatusCard } from "@/components/members/PaymentStatusCard";
import { PaymentsList } from "@/components/members/PaymentsList";
import { MemberActionButtons } from "@/components/members/MemberActionButtons";
import { StatusChangeDialog } from "@/components/members/StatusChangeDialog";
import { DeleteConfirmDialog } from "@/components/members/DeleteConfirmDialog";

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    member,
    payments,
    paymentStatus,
    loading,
    showDeleteDialog,
    showStatusDialog,
    setShowDeleteDialog,
    setShowStatusDialog,
    handleDelete,
    handleStatusChange,
  } = useMemberDetail(id);

  if (loading) {
    return (
      <MobileLayout title="Detalhes do Sócio">
        <div className="flex items-center justify-center h-full py-10">
          <p>Carregando dados...</p>
        </div>
      </MobileLayout>
    );
  }

  if (!member) {
    return null;
  }

  return (
    <MobileLayout title="Detalhes do Sócio">
      <div className="space-y-6">
        {/* Member info card */}
        <MemberInfoCard member={member} />

        {/* Payment status */}
        <PaymentStatusCard 
          upToDate={paymentStatus.upToDate} 
          unpaidMonths={paymentStatus.unpaidMonths} 
        />

        {/* Payments section */}
        <PaymentsList 
          payments={payments} 
          memberId={member.id} 
          memberName={member.name}
          memberPhoto={member.photo}
        />

        {/* Action buttons */}
        <MemberActionButtons
          onEdit={() => navigate(`/members/edit/${member.id}`)}
          onStatus={() => setShowStatusDialog(true)}
          onDelete={() => setShowDeleteDialog(true)}
        />

        {/* Status change dialog */}
        <StatusChangeDialog
          open={showStatusDialog}
          onOpenChange={setShowStatusDialog}
          onStatusChange={handleStatusChange}
        />

        {/* Delete confirmation dialog */}
        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
        />
      </div>
    </MobileLayout>
  );
};

export default MemberDetail;
