
import React from "react";

type MemberStatusCardsProps = {
  paidMembersCount: number;
  unpaidMembersCount: number;
};

export const MemberStatusCards: React.FC<MemberStatusCardsProps> = ({
  paidMembersCount,
  unpaidMembersCount,
}) => (
  <div className="mt-6 grid grid-cols-2 gap-4">
    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
      <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
        Sócios em Dia
      </h3>
      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
        {paidMembersCount}
      </p>
    </div>
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
        Sócios Inadimplentes
      </h3>
      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
        {unpaidMembersCount}
      </p>
    </div>
  </div>
);
