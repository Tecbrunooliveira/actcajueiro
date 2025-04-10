
/**
 * Serviço para funções de comunicação externa
 */

/**
 * Abre uma conversa no WhatsApp com o número de telefone especificado
 * @param phone Número de telefone para iniciar a conversa
 */
export const openWhatsApp = (phone: string): void => {
  // Limpar o número de telefone (remover parênteses, espaços e traços)
  const cleanedPhone = phone.replace(/\D/g, '');
  
  // Verificar se o número começa com 0 ou tem código do país
  let formattedPhone = cleanedPhone;
  
  // Se não começar com + (código do país), adicionar o código brasileiro
  if (!cleanedPhone.startsWith('+')) {
    // Se começar com 0, remover o 0
    if (cleanedPhone.startsWith('0')) {
      formattedPhone = cleanedPhone.substring(1);
    }
    // Adicionar código do Brasil (+55)
    formattedPhone = `55${formattedPhone}`;
  }
  
  // Criar URL do WhatsApp
  const whatsappUrl = `https://wa.me/${formattedPhone}`;
  
  // Abrir em nova janela/aba
  window.open(whatsappUrl, '_blank');
};
