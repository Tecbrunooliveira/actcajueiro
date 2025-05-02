
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

interface AnnouncementContentProps {
  announcement: any;
  currentIndex: number;
  totalAnnouncements: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onConfirm: (id: string) => void;
}

export function AnnouncementContent({
  announcement,
  currentIndex,
  totalAnnouncements,
  loading,
  onPrevious,
  onNext,
  onConfirm,
}: AnnouncementContentProps) {
  return (
    <>
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <div className="font-medium text-lg">{announcement.title}</div>
          <div className="my-2 whitespace-pre-wrap">{announcement.content}</div>
          <div className="text-xs text-gray-500 mt-4">
            Enviado em {new Date(announcement.created_at).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </div>

      <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
        {totalAnnouncements > 1 && (
          <div className="flex space-x-2 mr-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={currentIndex === 0 || loading}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={currentIndex === totalAnnouncements - 1 || loading}
            >
              Próximo <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
        
        <Button
          onClick={() => onConfirm(announcement.id)}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          Confirmar recebimento
        </Button>
      </DialogFooter>
    </>
  );
}
