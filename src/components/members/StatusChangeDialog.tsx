
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Status</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
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
