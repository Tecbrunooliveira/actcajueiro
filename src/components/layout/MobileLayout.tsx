
import React from "react";
import { useAuth } from "@/contexts/auth";
import { motion } from "framer-motion";
import { Header } from "./Header";
import { BottomNavigation } from "./BottomNavigation";

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  onBackClick?: () => void;
}

export function MobileLayout({ children, title, onBackClick }: MobileLayoutProps) {
  const { user, profile } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <Header title={title} onBackClick={onBackClick} user={user} />

      {/* Main content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex-1 container px-4 py-6 max-w-lg mx-auto"
      >
        {children}
      </motion.main>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
}
