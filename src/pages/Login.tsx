
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const { signIn, isAuthenticated } = useAuth();
  const { toast: showToast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
        setEmail("admin@example.com");
        setPassword("admin");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error:", error);
        if (error.message === "Invalid login credentials") {
          setErrorMessage("Credenciais inválidas. Verifique seu email e senha.");
        } else {
          setErrorMessage(error.message || "Erro ao fazer login. Tente novamente.");
        }
        showToast({
          title: "Erro no login",
          description: error.message || "Verifique suas credenciais e tente novamente",
          variant: "destructive",
        });
      } else {
        showToast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Ocorreu um erro durante o login. Tente novamente mais tarde.");
      showToast({
        title: "Erro no login",
        description: "Ocorreu um erro durante o login. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-club-600 to-club-700 items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-club-500">ACT Cajueiro</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive" className="text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              type="submit" 
              className="w-full bg-club-500 hover:bg-club-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>
            
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500 mb-2">
                Usuário padrão: admin@example.com / Senha: admin
              </p>
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
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
