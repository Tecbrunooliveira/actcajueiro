
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, CreditCard, BarChart3, Home } from "lucide-react";
import { cn } from "@/lib/utils";

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
    { icon: BarChart3, label: "Relatórios", path: "/reports" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground p-4 shadow-md">
        <h1 className="text-xl font-semibold text-center">{title}</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 container px-4 py-6 max-w-lg mx-auto">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="sticky bottom-0 z-10 bg-white border-t border-gray-200 shadow-lg">
        <ul className="flex justify-around">
          {navItems.map((item) => (
            <li key={item.path} className="flex-1">
              <Link
                to={item.path}
                className={cn(
                  "flex flex-col items-center py-3 px-1",
                  currentPath === item.path
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 mb-1",
                    currentPath === item.path
                      ? "text-primary"
                      : "text-gray-500"
                  )}
                />
                <span className="text-xs">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
