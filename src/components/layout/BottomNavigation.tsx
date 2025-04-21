
import React from "react";
import { useLocation } from "react-router-dom";
import { Users, CreditCard, BarChart3, Home, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { NavigationItem } from "./NavigationItem";
import { useAuth } from "@/contexts/auth";

export const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin } = useAuth();

  const navItems = [
    { icon: Home, label: "Início", path: "/" },
    { icon: Users, label: "Sócios", path: "/members" },
    ...(isAdmin ? [{ icon: CreditCard, label: "Pagamentos", path: "/payments" }] : []),
    ...(isAdmin ? [{ icon: Receipt, label: "Despesas", path: "/expenses" }] : []),
    { icon: BarChart3, label: "Relatórios", path: "/reports" },
  ];

  return (
    <motion.nav 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky bottom-0 z-10 bg-white dark:bg-club-900 border-t border-club-100 dark:border-club-800 shadow-lg"
    >
      <ul className="flex justify-around">
        {navItems.map((item, index) => (
          <NavigationItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            index={index}
            isActive={
              currentPath === item.path || 
              (item.path === "/expenses" && currentPath.startsWith("/expense"))
            }
          />
        ))}
      </ul>
    </motion.nav>
  );
};
