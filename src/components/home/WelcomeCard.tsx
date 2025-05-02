
import React from 'react';
import { Activity } from 'lucide-react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { motion } from "framer-motion";

export const WelcomeCard = () => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      <Card className="gradient-bg text-white overflow-hidden rounded-xl shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-1">Bem-vindo à ACT</h2>
              <p className="text-white/80 text-sm">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
