
import React from 'react';
import { Bell, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnnouncementEmptyProps {
  onReload: () => void;
}

export function AnnouncementEmpty({ onReload }: AnnouncementEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Bell className="h-8 w-8 text-gray-400 mb-4" />
      <p className="text-gray-500 text-center">Não há comunicados pendentes para exibir.</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onReload}>
        <RefreshCcw className="h-4 w-4 mr-2" />
        Verificar novamente
      </Button>
    </div>
  );
}
