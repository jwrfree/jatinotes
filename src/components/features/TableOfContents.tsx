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
    <nav className="min-w-[180px] animate-fade-in-up">
      <div className="py-2 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 px-4">
          Dalam Tulisan Ini
        </h4>
        <ul className="space-y-0.5">
          {toc.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(item.id);
                }}
                className={`text-left text-xs py-1.5 px-4 block w-full transition-all duration-300 border-l-2 ${activeId === item.id
                    ? "border-amber-500 text-amber-600 dark:text-amber-500 font-medium bg-amber-50/50 dark:bg-amber-500/10 rounded-r-lg"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
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
