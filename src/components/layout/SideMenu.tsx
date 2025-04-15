
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";

export const SideMenu = () => {
  const { signOut, user, profile } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logout bem-sucedido",
      description: "Você saiu da sua conta",
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-1">
          <Menu className="h-5 w-5 mr-2" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <SheetHeader className="pb-4">
          <SheetTitle>ACT Cajueiro</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
            <div className="h-10 w-10 rounded-full bg-club-400 flex items-center justify-center text-white">
              <span className="text-sm font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div>
              <div className="font-medium">{profile?.username || user?.email}</div>
              <div className="text-xs text-muted-foreground">{profile?.role || "Usuário"}</div>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-club-100 text-club-700"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
