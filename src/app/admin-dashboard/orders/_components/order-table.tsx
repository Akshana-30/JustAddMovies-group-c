"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  flexRender,
} from "@tanstack/react-table";
import type { Order } from "@/lib/schemas";
import { flattenOrders, RowData } from "@/lib/flatten";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  data: Order[];
};

export default function OrderTable({ data }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const tableData = React.useMemo(() => flattenOrders(data), [data]);

  const columns = React.useMemo<ColumnDef<RowData>[]>(
    () => [
      {
        accessorKey: "orderId",
        header: "Order ID",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "orderDate",
        header: "Date",
        cell: (info) => info.getValue<Date>().toDateString(),
        sortingFn: "datetime",
      },
      {
        accessorKey: "quantity",
        header: "Qty",
      },
      {
        accessorKey: "movieTitle",
        header: "Movie",
      },
      {
        accessorKey: "totalAmount",
        header: "Total SEK",
      },
      
      
    ],
    [],
  );

  const table = useReactTable<RowData>({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  
  return (
    <div className="flex-row max-w-3xl mx-auto border rounded-2xl p-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: "pointer" }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}

                  {{
                    asc: ` 🠉`,
                    desc: ` 🠋`,
                  }[header.column.getIsSorted() as string] ?? null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
