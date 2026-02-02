"use client";

import { useEffect, useState, useMemo } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>("");

  const toc = useMemo(() => {
    const items: TOCItem[] = [];
    const regex = /<(h2|h3)([^>]*)>(.*?)<\/\1>/gi;
    let match;
    let index = 0;
    
    while ((match = regex.exec(content)) !== null) {
      const tag = match[1];
      const attrs = match[2];
      const text = match[3].replace(/<[^>]*>?/gm, '').trim();
      
      const idMatch = /id=["'](.*?)["']/.exec(attrs);
      const id = idMatch ? idMatch[1] : text.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "") + `-${index}`;
      
      items.push({
        id,
        text,
        level: parseInt(tag.replace("h", "").replace("H", ""))
      });
      index++;
    }
    return items;
  }, [content]);

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    const headingElements = document.querySelectorAll("h2[id], h3[id]");
    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="space-y-4">
      <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
        Daftar Isi
      </h4>
      <ul className="space-y-2.5 text-sm">
        {toc.map((item) => (
          <li 
            key={item.id} 
            className={`${item.level === 3 ? "pl-4" : ""}`}
          >
            <a
              href={`#${item.id}`}
              className={`block transition-colors duration-200 hover:text-primary ${
                activeId === item.id
                  ? "text-primary font-medium"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: "smooth"
                });
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
