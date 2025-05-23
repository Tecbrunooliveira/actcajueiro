
import React from "react";
import { BarChart3, AlertCircle, RefreshCw, ServerCrash, Clock, Wifi, Database } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
                         error?.toLowerCase().includes("timeout") ||
                         error?.toLowerCase().includes("demorando");
  
  const isServerError = error?.toLowerCase().includes("statement") ||
                        error?.toLowerCase().includes("servidor") ||
                        error?.toLowerCase().includes("sobrecarregado");
                        
  const isConnectionError = error?.toLowerCase().includes("conexão") ||
                           error?.toLowerCase().includes("network") ||
                           error?.toLowerCase().includes("connection");
                           
  const isDatabaseError = error?.toLowerCase().includes("database") ||
                          error?.toLowerCase().includes("banco de dados") ||
                          error?.toLowerCase().includes("syntax");

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
            
            <div className="mt-4 space-y-1">
              <Skeleton className="h-4 w-24 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
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
                  : isConnectionError
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : isServerError
                      ? "bg-yellow-100 dark:bg-yellow-900/30"
                      : isDatabaseError
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
              }`}
            >
              {isTimeoutError ? (
                <Clock className="h-8 w-8 text-amber-500 dark:text-amber-400" />
              ) : isConnectionError ? (
                <Wifi className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              ) : isServerError ? (
                <ServerCrash className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
              ) : isDatabaseError ? (
                <Database className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
              )}
            </motion.div>
            
            <div className="space-y-2">
              <p className="text-club-700 dark:text-club-300 font-medium">
                {isTimeoutError 
                  ? "Tempo limite excedido" 
                  : isConnectionError
                    ? "Problema de conexão"
                    : isServerError
                      ? "Servidor sobrecarregado"
                      : isDatabaseError
                        ? "Erro no banco de dados"
                        : "Erro ao carregar dados"}
              </p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {isTimeoutError 
                  ? "O servidor está demorando para responder. Utilizando dados em cache quando disponíveis. Tente atualizar a página ou voltar mais tarde." 
                  : isConnectionError
                    ? "Verifique sua conexão com a internet e tente novamente."
                    : isServerError
                      ? "O servidor está sobrecarregado. Os dados serão carregados quando o servidor estiver disponível."
                      : isDatabaseError
                        ? "Erro ao consultar o banco de dados. Tente novamente ou contate o suporte."
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
