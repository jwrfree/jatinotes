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
    <div className="mt-12 rounded-[2rem] border border-zinc-200/70 bg-white/70 p-3 shadow-lg shadow-black/5 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {pageInfo.hasPreviousPage ? (
          <Link
            href={`${baseUrl}?before=${pageInfo.startCursor}`}
            className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-600 transition-all hover:border-amber-500/30 hover:text-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-amber-500"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-3 text-sm font-semibold text-zinc-300 cursor-not-allowed dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-zinc-700">
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </div>
        )}

        <div className="hidden flex-1 px-4 text-center sm:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
            Arsip Blog
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Jelajahi tulisan lama dan yang terbaru dengan navigasi halaman ini.
          </p>
        </div>

        {pageInfo.hasNextPage ? (
          <Link
            href={`${baseUrl}?after=${pageInfo.endCursor}`}
            className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-600 transition-all hover:border-amber-500/30 hover:text-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-amber-500"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-3 text-sm font-semibold text-zinc-300 cursor-not-allowed dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-zinc-700">
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
