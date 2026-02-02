"use client";

import Link from "next/link";
import { MotionDiv, fadeIn } from "@/components/Animations";
import { MoveLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background Ornaments */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full" />
      </div>

      <MotionDiv
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="rounded-[3rem] border border-zinc-200/50 bg-white/70 p-12 text-center shadow-2xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/70">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-4xl font-bold text-amber-500">
            404
          </div>
          
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Halaman Tidak Ditemukan
          </h1>
          
          <p className="mb-10 text-zinc-600 dark:text-zinc-400">
            Sepertinya catatan yang Anda cari sedang bersembunyi atau telah berpindah ke dimensi lain.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-sm font-semibold text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <MoveLeft className="h-4 w-4" />
              Kembali Sebelumnya
            </button>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}
