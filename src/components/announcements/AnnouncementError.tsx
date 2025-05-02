
import React from 'react';
import { AlertCircle, RefreshCcw, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AnnouncementErrorProps {
  error: string;
  isAdmin: boolean;
  isFixingRecords: boolean;
  onReload: () => void;
  onFixRecords: () => void;
}

export function AnnouncementError({ 
  error, 
  isAdmin, 
  isFixingRecords, 
  onReload, 
  onFixRecords 
}: AnnouncementErrorProps) {
  return (
    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
      <div className="flex items-center mb-2">
        <AlertCircle className="h-5 w-5 mr-2" />
        <strong>Erro ao carregar comunicados</strong>
      </div>
      <p>{error}</p>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={onReload}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
        
        {isAdmin && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onFixRecords}
            disabled={isFixingRecords}
            className="bg-amber-100 hover:bg-amber-200 border-amber-200"
          >
            {isFixingRecords ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Database className="h-4 w-4 mr-2" />
            )}
            Corrigir registros
          </Button>
        )}
      </div>
    </div>
  );
}
