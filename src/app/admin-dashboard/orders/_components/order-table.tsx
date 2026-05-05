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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

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
        cell: (info) => {
          const id = info.getValue<string>();
          return (
            <Link className="text-blue-400 text-xs" href={`/orders/${id}`}>
              {id}
            </Link>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue<string>();
          return (
            <span
              style={{
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "20px",
                background:
                  info.getValue<string>() === "PAID"
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(232,160,48,0.15)",
                color:
                  info.getValue<string>() === "PAID"
                    ? "#4ade80"
                    : "var(--gold)",
              }}
            >
              {status}
            </span>
          );
        },
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
      {
        accessorKey: "userId",
        header: "User ID",
        cell: (info) => {
          const uId = info.getValue<string>();
          return(
            <span className="text-xs">{uId}</span>
          )
        }
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
    <div className="flex-row max-w-6xl mx-auto border rounded-2xl p-4 bg-secondary">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
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
                </TableHead>
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
