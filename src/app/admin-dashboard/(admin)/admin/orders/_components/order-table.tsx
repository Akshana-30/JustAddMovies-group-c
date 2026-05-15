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
  ColumnFiltersState,
  getFilteredRowModel
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
import { ArrowUpDown, X } from "lucide-react";
import { useTransition } from "react";
import { Input } from "@/components/ui/input"

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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      size: 220,
      cell: (info) => {
        const id = info.getValue<string>();
        return (
          <span><Button variant="outline" size="xs" asChild>
              <Link href={`/orders/${id}/edit/`}>Edit</Link>
            </Button>
          <Link className="text-blue-400 text-xs pl-2" href={`/orders/${id}`}>
            {id}
          </Link></span>
          
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
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
      size: 160,
      cell: (info) => info.getValue<Date>().toDateString(),
      sortingFn: "datetime",
    },
    {
      id: "quantity",
      header: "Qty",
      size: 60,
      accessorFn: (row) =>
        row.orderItem.reduce((sum, oi) => sum + oi.quantity, 0),
    },
    {
      accessorKey: "userId",
      header: "User ID",
      size: 280,
      cell: (info) => {
        const uId = info.getValue<string>();
        return <span className="text-xs">{uId}</span>;
      },
    },
    {
      accessorKey: "totalAmount",
      header: () => <span className="flex justify-end">Total SEK</span>,
      size: 120,
      cell: (info) => {
        const price = info.getValue<number>();
        return <span className="flex justify-end">{formatPrice(price)}</span>;
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
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: "onChange",
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="flex flex-col justify-between bg-secondary rounded-2xl border mt-10 min-h-150">
      <div className="flex items-center py-4 ml-2">
        <div className="relative">
        <Input
          placeholder="Filter user id..."
          value={(table.getColumn("userId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("userId")?.setFilterValue(event.target.value)
          }
          className="min-w-90"
        />
        
    <button
      onClick={() => table.getColumn("userId")?.setFilterValue("")}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      <X className="h-4 w-4" />
    </button>
    </div>
      </div>
      <div className="flex-1">
      <Table className="table-fixed w-full">
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
      </div>
      <div className="flex justify-end space-x-2 py-4 mr-2">
        <Button
          size="sm"
          className="cursor-pointer"
          onClick={() =>
              startTransition(() =>
                table.previousPage(),
              )
            }
          
          disabled={!table.getCanPreviousPage() || isPending}
        >
          Previous
        </Button>
        <Button       
          size="sm"
          className="cursor-pointer"
          onClick={() =>
              startTransition(() =>
                table.nextPage(),
              )
            }
          disabled={!table.getCanNextPage() || isPending}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
