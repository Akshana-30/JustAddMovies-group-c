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
  getFilteredRowModel,
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
import { ArrowUpDown, X, MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

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
      runtime: number;
    };
  } & {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    movieId: string;
    orderId: string;
  })[];
  user: { name: string | null; email: string } | null;
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
  const [isPending, startTransition] = useTransition();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState([]);
  const router = useRouter();

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: (info) => {
        const id = info.getValue<string>();
        return (
          <Link
            className="text-blue-400 text-xs pl-2 block truncate max-w-20 md:max-w-full"
            href={`/orders/${id}`}
          >
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
      enableGlobalFilter: false,
      cell: (info) => {
        const date = info.getValue<Date>();
        return (
          <span className="ml-3">
            {new Intl.DateTimeFormat("sv-SE").format(date)}
          </span>
        );
      },
    },
    {
      id: "quantity",
      header: "Qty",
      enableGlobalFilter: false,
      accessorFn: (row) =>
        row.orderItem.reduce((sum, oi) => sum + oi.quantity, 0),
    },
    {
      accessorKey: "userId",
      header: () => <span className="block">User ID</span>,
      cell: (info) => {
        const uId = info.getValue<string>();
        return (
          <span className="text-xs block truncate max-w-20 md:max-w-full">
            {uId}
          </span>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: () => <span className="flex justify-end">Total SEK</span>,
      cell: (info) => {
        const price = info.getValue<number>();
        return <span className="flex justify-end">{formatPrice(price)}</span>;
      },
    },
    {
      id: "actions",
      header: () => <span className="flex justify-end">Actions</span>,
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push(`/orders/${id}/edit`)}
                >
                  Edit order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
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
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: "onChange",
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="flex flex-col justify-between border border-(--gold)/30 bg-sidebar-accent/40 rounded-2xl mt-10 min-h-150">
      <div className="flex items-center py-4 ml-2 mr-2">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Filter..."
            value={globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            className="bg-secondary/70 w-full border-(--gold)/30"
          />

          <button
            onClick={() => table.setGlobalFilter(String(""))}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto">
        <Table className="w-full min-w-150 text-sm">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
      </div>
      <div className="flex justify-end space-x-2 py-4 mr-2">
        <Button
          size="sm"
          className="cursor-pointer"
          onClick={() => startTransition(() => table.previousPage())}
          disabled={!table.getCanPreviousPage() || isPending}
        >
          Previous
        </Button>
        <Button
          size="sm"
          className="cursor-pointer"
          onClick={() => startTransition(() => table.nextPage())}
          disabled={!table.getCanNextPage() || isPending}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
