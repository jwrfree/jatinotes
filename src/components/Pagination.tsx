"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageInfo } from "@/lib/types";

interface PaginationProps {
  pageInfo: PageInfo;
  baseUrl: string;
}

export default function Pagination({ pageInfo, baseUrl }: PaginationProps) {
  if (!pageInfo.hasNextPage && !pageInfo.hasPreviousPage) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-16">
      {pageInfo.hasPreviousPage ? (
        <Link
          href={`${baseUrl}?before=${pageInfo.startCursor}`}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </Link>
      ) : (
        <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 text-sm font-bold text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </div>
      )}

      {pageInfo.hasNextPage ? (
        <Link
          href={`${baseUrl}?after=${pageInfo.endCursor}`}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-all shadow-sm"
        >
          Selanjutnya
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 text-sm font-bold text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
          Selanjutnya
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
