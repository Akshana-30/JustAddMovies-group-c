"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

type OrderType = ({
  orderItem: ({
    movies: {
      id: string;
      title: string;
      description: string;
      price: number;
      releaseDate: Date;
      imageUrl: string;
      stock: number;
      deletedAt: Date | null;
      runtime: number;
    };
  } & {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    movieId: string;
    orderId: string;
  })[];
} & {
  id: string;
  totalAmount: number;
  status: string;
  orderDate: Date;
  userId: string;
})[];

type Order = OrderType[number];

export type Props = {
  data: OrderType;
};

export default function OrderTable({ data }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
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
                status === "PAID"
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(232,160,48,0.15)",
              color: status === "PAID" ? "#4ade80" : "var(--gold)",
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "orderDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => info.getValue<Date>().toDateString(),
      sortingFn: "datetime",
    },
    {
      id: "quantity",
      header: "Qty",
      accessorFn: (row) =>
        row.orderItem.reduce((sum, oi) => sum + oi.quantity, 0),
    },
    {
      accessorKey: "userId",
      header: "User ID",
      cell: (info) => {
        const uId = info.getValue<string>();
        return <span className="text-xs">{uId}</span>;
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total SEK",
      cell: (info) => {
        const price = info.getValue<number>();
        return <span className="text-right">{formatPrice(price)}</span>;
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="bg-secondary overflow-hidden rounded-md border max-w-6xl mx-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4 mr-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
