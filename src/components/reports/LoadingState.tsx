
import React from "react";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
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
      </motion.div>
    </div>
  );
};
