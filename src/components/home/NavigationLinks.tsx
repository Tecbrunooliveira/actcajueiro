
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, BarChart3, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";

export const NavigationLinks = () => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="space-y-4">
      <h2 className="text-lg font-medium text-club-800 dark:text-club-100 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-club-600" />
        Navegação
      </h2>
      <div className="space-y-3">
        <Link to="/members">
          <Card className="hover:bg-club-50 dark:hover:bg-club-800/50 transition-all duration-200 border border-club-100 dark:border-club-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-club-100 dark:bg-club-700 p-2 rounded-lg">
                <Users className="h-6 w-6 text-club-600 dark:text-club-200" />
              </div>
              <div>
                <CardTitle className="text-base text-club-800 dark:text-club-100">Sócios</CardTitle>
                <CardDescription className="text-club-600 dark:text-club-300">
                  Gerenciar cadastro de sócios
                </CardDescription>
              </div>
              <ArrowRight className="h-5 w-5 text-club-400 dark:text-club-500 ml-auto" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/payments">
          <Card className="hover:bg-club-50 dark:hover:bg-club-800/50 transition-all duration-200 border border-club-100 dark:border-club-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-club-100 dark:bg-club-700 p-2 rounded-lg">
                <CreditCard className="h-6 w-6 text-club-600 dark:text-club-200" />
              </div>
              <div>
                <CardTitle className="text-base text-club-800 dark:text-club-100">Pagamentos</CardTitle>
                <CardDescription className="text-club-600 dark:text-club-300">
                  Registrar e consultar pagamentos
                </CardDescription>
              </div>
              <ArrowRight className="h-5 w-5 text-club-400 dark:text-club-500 ml-auto" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/reports">
          <Card className="hover:bg-club-50 dark:hover:bg-club-800/50 transition-all duration-200 border border-club-100 dark:border-club-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-club-100 dark:bg-club-700 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-club-600 dark:text-club-200" />
              </div>
              <div>
                <CardTitle className="text-base text-club-800 dark:text-club-100">Relatórios</CardTitle>
                <CardDescription className="text-club-600 dark:text-club-300">
                  Visualizar relatórios de pagamentos
                </CardDescription>
              </div>
              <ArrowRight className="h-5 w-5 text-club-400 dark:text-club-500 ml-auto" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </motion.div>
  );
};
