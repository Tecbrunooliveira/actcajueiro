
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

type MembersTabProps = {
  memberStatusData: { name: string; value: number; color: string }[];
  getTableTotal: (list: { value: number }[]) => number;
};

export const MembersTab: React.FC<MembersTabProps> = ({
  memberStatusData,
  getTableTotal,
}) => (
  <div className="max-w-lg mx-auto">
    <h3 className="text-md font-semibold mb-4">Detalhes por Status</h3>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead className="text-right">Percentual</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {memberStatusData.map((item, idx, arr) => {
          const total = getTableTotal(arr);
          return (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell className="text-right">{item.value}</TableCell>
              <TableCell className="text-right">
                {total > 0
                  ? `${((item.value / total) * 100).toFixed(1)}%`
                  : "0%"}
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow className="font-medium">
          <TableCell>Total</TableCell>
          <TableCell className="text-right">
            {getTableTotal(memberStatusData)}
          </TableCell>
          <TableCell className="text-right">100%</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);
