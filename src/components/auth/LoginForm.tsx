
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type LoginFormProps = {
  defaultEmail?: string;
  defaultPassword?: string;
};

const LoginForm = ({ defaultEmail = "admin@example.com", defaultPassword = "admin" }: LoginFormProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { signIn } = useAuth();
  const { toast: showToast } = useToast();
  const navigate = useNavigate();

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
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
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
      </div>
      <div className="mt-6">
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
      </div>
    </form>
  );
};

export default LoginForm;
