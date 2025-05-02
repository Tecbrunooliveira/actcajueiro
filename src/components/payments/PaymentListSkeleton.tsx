
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const PaymentListSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array(4).fill(0).map((_, index) => (
        <div key={index} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Skeleton className="h-12 w-12 rounded-full mr-3" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="h-5 w-20 mb-1" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
