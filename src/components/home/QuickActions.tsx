
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const QuickActions = () => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="space-y-4">
      <h2 className="text-lg font-medium text-club-800 dark:text-club-100 flex items-center">
        <PlusCircle className="h-5 w-5 mr-2 text-club-600" />
        Ações Rápidas
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/members/new">
          <Button className="w-full gradient-bg hover:bg-gradient-to-r hover:from-club-600 hover:via-club-500 hover:to-club-400 rounded-lg py-3 h-auto">
            <Users className="h-4 w-4 mr-2" />
            Novo Sócio
          </Button>
        </Link>
        <Link to="/payments/new">
          <Button className="w-full gradient-bg hover:bg-gradient-to-r hover:from-club-600 hover:via-club-500 hover:to-club-400 rounded-lg py-3 h-auto">
            <CreditCard className="h-4 w-4 mr-2" />
            Novo Pagamento
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
