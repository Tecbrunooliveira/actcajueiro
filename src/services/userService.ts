
import { supabase } from "@/integrations/supabase/client";

// Função para criar usuário pelo admin (server role)
export const userService = {
  createUser: async (email: string, password: string): Promise<{ userId: string | null, error: any }> => {
    // Usa rpc da Edge Function se necessário; aqui vamos direto (pode requerer service role token/back-end, depende do projeto)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    return {
      userId: data?.user?.id || null,
      error,
    };
  }
};
