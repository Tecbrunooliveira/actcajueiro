
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

type ExpensesTabProps = {
  expensesData: { name: string; value: number; color: string }[];
  getTableTotal: (list: { value: number }[]) => number;
};

export const ExpensesTab: React.FC<ExpensesTabProps> = ({
  expensesData,
  getTableTotal,
}) => (
  <div className="max-w-lg mx-auto">
    <h3 className="text-md font-semibold mb-4">Despesas por Categoria</h3>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Percentual</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expensesData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center italic py-4">
              Nenhuma despesa registrada para este período
            </TableCell>
          </TableRow>
        ) : (
          expensesData.map((item, idx, arr) => {
            const total = getTableTotal(arr);
            return (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">
                  {item.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {total > 0
                    ? `${((item.value / total) * 100).toFixed(1)}%`
                    : "0%"}
                </TableCell>
              </TableRow>
            );
          })
        )}
        {expensesData.length > 0 && (
          <TableRow className="font-medium">
            <TableCell>Total</TableCell>
            <TableCell className="text-right">
              {getTableTotal(expensesData).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </TableCell>
            <TableCell className="text-right">100%</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
