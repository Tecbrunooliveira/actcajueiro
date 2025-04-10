
import React from "react";
import { BarChart3 } from "lucide-react";

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full py-10">
      <div className="text-center space-y-4">
        <BarChart3 className="h-10 w-10 mx-auto animate-pulse text-primary" />
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    </div>
  );
};
