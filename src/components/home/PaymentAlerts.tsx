
import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Payment } from "@/types";
import { motion } from "framer-motion";

interface PaymentAlertsProps {
  unpaidPayments: Payment[];
}

export const PaymentAlerts = ({ unpaidPayments }: PaymentAlertsProps) => {
  if (unpaidPayments.length === 0) return null;

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      <Card className="border-club-300 bg-club-50 dark:bg-club-800/30 dark:border-club-700 rounded-xl overflow-hidden shadow-md">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="bg-club-100 dark:bg-club-700/50 p-1.5 rounded-full">
              <AlertTriangle className="h-4 w-4 text-club-600 dark:text-club-300" />
            </div>
            <CardTitle className="text-base text-club-700 dark:text-club-100">
              Pagamentos Pendentes
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-club-600 dark:text-club-200">
            Existem {unpaidPayments.length} pagamentos pendentes.
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Link to="/reports" className="text-club-600 dark:text-club-300 text-sm font-medium flex items-center hover:text-club-700 dark:hover:text-club-200 transition-colors">
            Ver relatório
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
