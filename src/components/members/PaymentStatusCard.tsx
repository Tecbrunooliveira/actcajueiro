
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMonthBadge } from "@/services/formatters";

interface PaymentStatusCardProps {
  upToDate: boolean;
  unpaidMonths: string[];
}

export function PaymentStatusCard({ upToDate, unpaidMonths }: PaymentStatusCardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg",
        upToDate
          ? "bg-green-50 border border-green-200"
          : "bg-red-50 border border-red-200"
      )}
    >
      <div className="flex items-center space-x-2">
        {upToDate ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        )}
        <h3
          className={cn(
            "font-medium",
            upToDate ? "text-green-700" : "text-red-700"
          )}
        >
          {upToDate
            ? "Pagamentos em dia"
            : "Pagamentos pendentes"}
        </h3>
      </div>
      {!upToDate && (
        <div className="mt-2 text-sm text-red-600">
          <p>Meses pendentes:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {unpaidMonths.map((month) => (
              <Badge
                key={month}
                variant="outline"
                className="border-red-300 text-red-700"
              >
                {formatMonthBadge(month)}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
