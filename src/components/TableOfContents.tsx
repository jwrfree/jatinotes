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
    <nav className="min-w-[200px] animate-fade-in-up">
      <div className="p-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6 px-3">
          Dalam Tulisan Ini
        </h4>
        <ul className="space-y-2 border-l border-zinc-200 dark:border-zinc-800">
          {toc.map((item) => (
            <li key={item.id} style={{ marginLeft: -1 }}>
              <button
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(item.id);
                }}
                className={`text-left text-sm py-1 px-4 block w-full transition-all duration-300 border-l-2 ${activeId === item.id
                    ? "border-amber-500 text-amber-600 dark:text-amber-500 font-bold translate-x-1"
                    : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
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
