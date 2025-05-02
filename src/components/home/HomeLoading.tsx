
import React from 'react';
import { MobileLayout } from "@/components/layout/MobileLayout";

export const HomeLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-club-300 border-t-club-600 rounded-full animate-spin"></div>
      <p className="text-club-700 font-medium">Carregando dados...</p>
    </div>
  );
};
