
import React from "react";
import { BarChart3, AlertCircle, RefreshCw, ServerCrash, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface LoadingStateProps {
  error?: string | null;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  error = null,
  onRetry,
  isRetrying = false
}) => {
  const isTimeoutError = error?.toLowerCase().includes("tempo limite") || 
                         error?.toLowerCase().includes("timeout");
  
  const isServerError = error?.toLowerCase().includes("statement") ||
                        error?.toLowerCase().includes("servidor");

  return (
    <div className="flex items-center justify-center h-full py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        {!error ? (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7] 
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="h-16 w-16 mx-auto bg-gradient-to-r from-club-400 to-club-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <BarChart3 className="h-8 w-8 text-white" />
            </motion.div>
            
            <div className="space-y-2">
              <p className="text-club-700 dark:text-club-300 font-medium">Carregando dados...</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Os relatórios estão sendo preparados. Este processo pode levar alguns instantes.
              </p>
            </div>
            
            <div className="w-48 h-2 bg-club-100 dark:bg-club-800 rounded-full mx-auto overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-club-400 to-club-600"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: "linear"
                }}
              />
            </div>
          </>
        ) : (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
              className={`h-16 w-16 mx-auto rounded-full flex items-center justify-center shadow-lg ${
                isTimeoutError 
                  ? "bg-amber-100 dark:bg-amber-900/30" 
                  : isServerError
                    ? "bg-yellow-100 dark:bg-yellow-900/30"
                    : "bg-red-100 dark:bg-red-900/30"
              }`}
            >
              {isTimeoutError ? (
                <Clock className="h-8 w-8 text-amber-500 dark:text-amber-400" />
              ) : isServerError ? (
                <ServerCrash className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
              )}
            </motion.div>
            
            <div className="space-y-2">
              <p className="text-club-700 dark:text-club-300 font-medium">
                {isTimeoutError 
                  ? "Tempo limite excedido" 
                  : isServerError
                    ? "Servidor sobrecarregado"
                    : "Erro ao carregar dados"}
              </p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {isTimeoutError 
                  ? "O servidor está demorando para responder. Os dados estão sendo carregados em segundo plano, aguarde um momento." 
                  : isServerError
                    ? "O servidor está sobrecarregado. Os dados serão carregados assim que possível."
                    : error || "Ocorreu um erro ao carregar os relatórios. Tente novamente em alguns instantes."}
              </p>
            </div>
            
            {onRetry && (
              <Button 
                onClick={onRetry} 
                variant="outline" 
                className="mx-auto mt-2 flex items-center gap-2"
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <>
                    <div className="h-4 w-4 border-2 border-club-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Tentar novamente
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};
