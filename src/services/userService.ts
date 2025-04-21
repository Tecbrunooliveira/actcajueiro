
import { supabase } from "@/integrations/supabase/client";

// Função para criar usuário usando uma Edge Function 
// que executa com permissões de service role
export const userService = {
  createUser: async (email: string, password: string): Promise<{ userId: string | null, error: any }> => {
    try {
      // Chama a edge function criada para criar usuários
      const response = await fetch(
        `${process.env.SUPABASE_URL || 'https://vamcxqpesqfnobqpbjaz.supabase.co'}/functions/v1/create-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          userId: null,
          error: { message: result.error || 'Erro ao criar usuário' },
        };
      }

      return {
        userId: result.userId,
        error: null,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        userId: null,
        error: { message: error.message || 'Erro ao criar usuário' },
      };
    }
  }
};
