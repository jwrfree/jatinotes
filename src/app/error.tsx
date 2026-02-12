"use client";

import { useEffect } from "react";
import ContentCard from "@/components/layout/ContentCard";
import BackgroundOrnaments from "@/components/ui/BackgroundOrnaments";
import { RefreshCw, Home, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 pt-20">
      <BackgroundOrnaments variant="subtle" />

      <ContentCard maxWidth="max-w-3xl" containerClassName="pt-0 sm:pt-0 pb-0 sm:pb-0" className="text-center">
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="h-10 w-10" />
        </div>
        
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Terjadi Kesalahan
        </h1>
        
        <p className="mb-10 text-zinc-600 dark:text-zinc-400">
          Maaf, sistem sedang mengalami kendala teknis saat memuat catatan ini.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-600"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-sm font-semibold text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </ContentCard>
    </div>
  );
}
