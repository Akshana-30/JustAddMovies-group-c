"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  currentPage: number;
  totalPages: number;
}

export function MoviePagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function handleNav(page: number) {
    router.push(buildHref(page));
  }

  // Build the page number list with ellipsis.
  // Always show first, last, current ±1. Fill with "…" elsewhere.
  function getPageItems(): (number | "ellipsis")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: (number | "ellipsis")[] = [];
    const around = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1].filter(n => n >= 1 && n <= totalPages));
    let prev = 0;
    for (const n of [...around].sort((a, b) => a - b)) {
      if (n - prev > 1) items.push("ellipsis");
      items.push(n);
      prev = n;
    }
    return items;
  }

  const items = getPageItems();

  return (
    <div className="py-6">
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href={buildHref(currentPage - 1)}
              onClick={(e) => { e.preventDefault(); if (currentPage > 1) handleNav(currentPage - 1); }}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
            />
          </PaginationItem>

          {/* Page numbers */}
          {items.map((item, i) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href={buildHref(item)}
                  onClick={(e) => { e.preventDefault(); handleNav(item); }}
                  isActive={item === currentPage}
                  className="cursor-pointer"
                  style={item === currentPage ? { borderColor: "var(--gold)", color: "var(--gold)" } : undefined}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href={buildHref(currentPage + 1)}
              onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) handleNav(currentPage + 1); }}
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
