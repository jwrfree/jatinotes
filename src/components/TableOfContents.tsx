"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Parse the content to find headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = Array.from(doc.querySelectorAll("h2, h3"));

    const tocItems: TOCItem[] = headings.map((heading, index) => {
      const text = heading.textContent || "";
      // Generate ID from text if it doesn't exist
      const id = heading.id || text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") + `-${index}`;
      
      // Update the actual heading in the DOM later via side effect or 
      // by ensuring the content rendering logic includes these IDs
      return {
        id,
        text,
        level: parseInt(heading.tagName.replace("H", ""))
      };
    });

    setToc(tocItems);
  }, [content]);

  useEffect(() => {
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
