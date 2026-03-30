"use client";

import { useEffect, useState } from "react";
import { TocItem } from "@/lib/sanitize";

export default function TableOfContents({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66% 0px" }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="min-w-[220px] animate-fade-in-up rounded-[1.75rem] border border-zinc-200/70 bg-white/75 p-4 shadow-xl shadow-black/5 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/75">
      <div className="max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar pr-1">
        <h4 className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
          Dalam Tulisan Ini
        </h4>
        <ul className="space-y-1">
          {toc.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(item.id);
                }}
                className={`block w-full rounded-2xl border px-3 py-2 text-left text-xs leading-relaxed transition-all duration-300 ${
                  activeId === item.id
                    ? "border-amber-500/30 bg-amber-50 text-amber-700 shadow-sm dark:bg-amber-500/10 dark:text-amber-400"
                    : "border-transparent text-zinc-500 hover:border-zinc-200 hover:bg-white/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:bg-zinc-950/60 dark:hover:text-zinc-200"
                }`}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
