
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { SideMenu } from "./SideMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { List } from "lucide-react";

interface HeaderProps {
  title: string;
  onBackClick?: () => void;
  user?: {
    email?: string;
  };
}

export const Header = ({ title, onBackClick, user }: HeaderProps) => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-10 gradient-bg text-white p-4 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {onBackClick && (
            <button 
              onClick={onBackClick} 
              className="p-1 mr-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          <Sheet>
            <SheetTrigger className="p-1 mr-2">
              <List className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SideMenu onClose={() => document.body.click()} />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="h-8 w-8 rounded-full bg-club-400/30 backdrop-blur-sm flex items-center justify-center">
          <span className="text-sm font-semibold">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </span>
        </div>
      </div>
    </motion.header>
  );
};
