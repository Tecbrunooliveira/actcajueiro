
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MobileLayout title="Página não encontrada">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">404</h1>
        <p className="text-center text-gray-600 mb-8">
          Ops! A página que você está procurando não existe.
        </p>
        <Link to="/">
          <Button className="bg-club-500 hover:bg-club-600">
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </MobileLayout>
  );
};

export default NotFound;
