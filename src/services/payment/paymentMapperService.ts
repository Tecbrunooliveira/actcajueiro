
import { Payment } from "@/types";

export const paymentMapperService = {
  mapDBToPayment: (data: any): Payment => {
    return {
      id: data.id,
      memberId: data.member_id,
      amount: data.amount,
      date: data.payment_date || "",
      month: data.month,
      year: data.year,
      isPaid: data.is_paid,
      paymentMethod: data.payment_method || undefined,
      notes: data.notes || undefined,
    };
  },
  
  mapPaymentToDB: (payment: Omit<Payment, "id"> | Payment) => {
    return {
      ...(('id' in payment) && { id: payment.id }),
      member_id: payment.memberId,
      amount: payment.amount,
      payment_date: payment.date || null,
      month: payment.month,
      year: payment.year,
      is_paid: payment.isPaid,
      payment_method: payment.paymentMethod || null,
      notes: payment.notes || null,
    };
  }
};
