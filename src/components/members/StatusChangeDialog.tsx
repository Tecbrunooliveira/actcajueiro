
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberStatus } from "@/types";

interface StatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: MemberStatus) => void;
}

export function StatusChangeDialog({
  open,
  onOpenChange,
  onStatusChange,
}: StatusChangeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar Status</DialogTitle>
          <DialogDescription>
            Selecione o novo status para o sócio
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <Button
            variant="outline"
            className="w-full justify-start text-green-700"
            onClick={() => onStatusChange("frequentante")}
          >
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            Frequentante
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-amber-700"
            onClick={() => onStatusChange("afastado")}
          >
            <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
            Afastado
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-700"
            onClick={() => onStatusChange("advertido")}
          >
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            Advertido
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-orange-700"
            onClick={() => onStatusChange("suspenso")}
          >
            <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
            Suspenso
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-yellow-700"
            onClick={() => onStatusChange("licenciado")}
          >
            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            Licenciado
          </Button>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
