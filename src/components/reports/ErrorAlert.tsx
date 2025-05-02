
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  error: string;
  onRetry: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry }) => {
  return (
    <Alert variant="destructive" className="my-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="self-start mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      </AlertDescription>
    </Alert>
  );
};
