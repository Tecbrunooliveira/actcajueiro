import React from "react";
import { 
  Home,
  Users,
  CreditCard,
  BarChart4,
  FileText,
  LogOut,
  User,
  UserPlus
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

interface SideMenuProps {
  onClose: () => void;
}

export function SideMenu({ onClose }: SideMenuProps) {
  const { signOut, user, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="flex flex-col justify-between h-full overflow-y-auto bg-white">
      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-club-500">ACT CAJUEIRO</h2>
          <p className="text-sm text-gray-500">Sistema de Gestão</p>
        </div>
        
        <nav className="space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm ${
                isActive
                  ? "bg-club-50 text-club-700 font-medium"
                  : "text-gray-700 hover:bg-club-50 hover:text-club-700"
              }`
            }
            onClick={onClose}
          >
            <Home className="mr-3 h-5 w-5" />
            Início
          </NavLink>
          
          <NavLink
            to="/members"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm ${
                isActive
                  ? "bg-club-50 text-club-700 font-medium"
                  : "text-gray-700 hover:bg-club-50 hover:text-club-700"
              }`
            }
            onClick={onClose}
          >
            <Users className="mr-3 h-5 w-5" />
            Sócios
          </NavLink>
          
          {isAdmin && (
            <>
              <NavLink
                to="/payments"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm ${
                    isActive
                      ? "bg-club-50 text-club-700 font-medium"
                      : "text-gray-700 hover:bg-club-50 hover:text-club-700"
                  }`
                }
                onClick={onClose}
              >
                <CreditCard className="mr-3 h-5 w-5" />
                Mensalidades
              </NavLink>
              <NavLink
                to="/expenses"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm ${
                    isActive
                      ? "bg-club-50 text-club-700 font-medium"
                      : "text-gray-700 hover:bg-club-50 hover:text-club-700"
                  }`
                }
                onClick={onClose}
              >
                <FileText className="mr-3 h-5 w-5" />
                Despesas
              </NavLink>
            </>
          )}
          
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm ${
                isActive
                  ? "bg-club-50 text-club-700 font-medium"
                  : "text-gray-700 hover:bg-club-50 hover:text-club-700"
              }`
            }
            onClick={onClose}
          >
            <BarChart4 className="mr-3 h-5 w-5" />
            Relatórios
          </NavLink>
          
          {isAdmin && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                }`
              }
              onClick={onClose}
            >
              <UserPlus className="mr-3 h-5 w-5" />
              Gerenciar Usuários
            </NavLink>
          )}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <NavLink
          to="/me"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 mb-2 rounded-md text-sm ${
              isActive
                ? "bg-club-50 text-club-700 font-medium"
                : "text-gray-700 hover:bg-club-50 hover:text-club-700"
            }`
          }
          onClick={onClose}
        >
          <User className="mr-3 h-5 w-5" />
          Meu Perfil
        </NavLink>
        
        <button
          onClick={handleSignOut}
          className="flex w-full items-center px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );
}
