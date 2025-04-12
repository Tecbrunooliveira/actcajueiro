
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, CreditCard, BarChart3, Home, Receipt, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function MobileLayout({ children, title }: MobileLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Home, label: "Início", path: "/" },
    { icon: Users, label: "Sócios", path: "/members" },
    { icon: CreditCard, label: "Pagamentos", path: "/payments" },
    { icon: Receipt, label: "Despesas", path: "/expenses" },
    { icon: BarChart3, label: "Relatórios", path: "/reports" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-10 gradient-bg text-white p-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Menu className="h-5 w-5 mr-2" />
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <div className="h-8 w-8 rounded-full bg-club-400/30 backdrop-blur-sm flex items-center justify-center">
            <span className="text-sm font-semibold">AC</span>
          </div>
        </div>
      </motion.header>

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
      <motion.nav 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky bottom-0 z-10 bg-white dark:bg-club-900 border-t border-club-100 dark:border-club-800 shadow-lg"
      >
        <ul className="flex justify-around">
          {navItems.map((item, index) => (
            <motion.li 
              key={item.path} 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <Link
                to={item.path}
                className={cn(
                  "flex flex-col items-center py-3 px-1 relative",
                  currentPath === item.path || 
                  (item.path === "/expenses" && currentPath.startsWith("/expense"))
                    ? "text-club-500"
                    : "text-gray-500 hover:text-club-600"
                )}
              >
                {currentPath === item.path || 
                (item.path === "/expenses" && currentPath.startsWith("/expense")) ? (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-club-500 rounded-full" />
                ) : null}
                <item.icon
                  className={cn(
                    "h-5 w-5 mb-1",
                    currentPath === item.path || 
                    (item.path === "/expenses" && currentPath.startsWith("/expense"))
                      ? "text-club-500"
                      : "text-gray-500"
                  )}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.nav>
    </div>
  );
}
