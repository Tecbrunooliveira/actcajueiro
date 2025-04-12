
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type CreateAdminButtonProps = {
  onSuccess?: (email: string, password: string) => void;
};

const CreateAdminButton = ({ onSuccess }: CreateAdminButtonProps) => {
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const createAdminUser = async () => {
    try {
      setCreatingAdmin(true);
      const response = await fetch(`${window.location.origin}/functions/v1/create-admin-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Usuário admin criado com sucesso", {
          description: "Agora você pode fazer login com admin@example.com e senha admin"
        });
        if (onSuccess) {
          onSuccess("admin@example.com", "admin");
        }
      } else {
        toast.error("Erro ao criar usuário admin", {
          description: data.error || "Tente novamente mais tarde"
        });
      }
    } catch (error) {
      console.error("Error creating admin user:", error);
      toast.error("Erro ao criar usuário admin", {
        description: "Verifique o console para mais detalhes"
      });
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <Button 
      type="button"
      variant="outline" 
      size="sm"
      onClick={createAdminUser}
      disabled={creatingAdmin}
      className="text-xs"
    >
      {creatingAdmin ? (
        <>
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Criando...
        </>
      ) : (
        "Criar usuário admin padrão"
      )}
    </Button>
  );
};

export default CreateAdminButton;
