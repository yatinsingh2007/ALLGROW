"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface DashboardPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const DashboardPagination: React.FC<DashboardPaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  // Show only first 10 pages (or fewer if totalPages < 10)
  const pages = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);

  return (
    <Pagination>
      <PaginationPrevious
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="bg-black text-white cursor-pointer"
      >
        Prev
      </PaginationPrevious>

      <PaginationContent>
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              className={`px-4 mx-0.5 py-1 rounded ${
                page === currentPage
                  ? "bg-white text-black font-semibold shadow-md"
                  : "bg-black text-white cursor-pointer"
              }`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPages > 10 && (
          <PaginationEllipsis className="text-gray-400 select-none" />
        )}
      </PaginationContent>

      <PaginationNext
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="bg-black text-white cursor-pointer"
      >
        Next
      </PaginationNext>
    </Pagination>
  );
};

export default DashboardPagination;

