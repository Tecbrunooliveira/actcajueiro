
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import CreateAdminButton from "@/components/auth/CreateAdminButton";

const Login = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleAdminCreationSuccess = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-club-600 to-club-700 items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-club-500">ACT Cajueiro</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm defaultEmail={email} defaultPassword={password} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <div className="text-center pt-2">
            <p className="text-sm text-gray-500 mb-2">
              Usuário padrão: admin@example.com / Senha: admin
            </p>
            <CreateAdminButton onSuccess={handleAdminCreationSuccess} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
