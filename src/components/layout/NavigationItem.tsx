
import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavigationItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  index: number;
}

export const NavigationItem = ({ icon: Icon, label, path, isActive, index }: NavigationItemProps) => {
  return (
    <motion.li 
      className="flex-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
    >
      <Link
        to={path}
        className={cn(
          "flex flex-col items-center py-3 px-1 relative",
          isActive ? "text-club-500" : "text-gray-500 hover:text-club-600"
        )}
      >
        {isActive && (
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-club-500 rounded-full" />
        )}
        <Icon
          className={cn(
            "h-5 w-5 mb-1",
            isActive ? "text-club-500" : "text-gray-500"
          )}
        />
        <span className="text-xs font-medium">{label}</span>
      </Link>
    </motion.li>
  );
};
