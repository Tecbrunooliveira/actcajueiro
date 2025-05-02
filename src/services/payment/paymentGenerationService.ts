
import { supabase } from "@/integrations/supabase/client";
import { memberService } from "@/services/memberService";

export const paymentGenerationService = {
  generatePendingPaymentsForMonth: async (month: string, year: number, amount: number = 30): Promise<number> => {
    try {
      const members = await memberService.getAllMembers();
      const activeMembersIds = members
        .filter(member => member.status === 'frequentante')
        .map(member => member.id);
      
      // Buscar pagamentos existentes para o mês
      const { data: existingPaymentsData, error: queryError } = await supabase
        .from('payments')
        .select('member_id')
        .eq('month', month)
        .eq('year', year);
      
      if (queryError) {
        console.error('Erro ao consultar pagamentos existentes:', queryError);
        throw queryError;
      }
      
      const membersWithPayments = new Set(existingPaymentsData.map(payment => payment.member_id));
      const membersWithoutPayments = activeMembersIds.filter(id => !membersWithPayments.has(id));
      
      const newPayments = membersWithoutPayments.map(memberId => ({
        member_id: memberId,
        amount: amount,
        payment_date: null,
        month: month,
        year: year,
        is_paid: false,
        payment_method: null,
        notes: "Gerado automaticamente"
      }));
      
      if (newPayments.length === 0) {
        return 0;
      }
      
      const { error } = await supabase
        .from('payments')
        .insert(newPayments);
      
      if (error) {
        console.error('Erro ao gerar pagamentos pendentes:', error);
        throw error;
      }
      
      return newPayments.length;
    } catch (error) {
      console.error('Erro ao gerar pagamentos pendentes:', error);
      throw error;
    }
  }
};
