"use client";
import { m, useSpring, useMotionValue } from "framer-motion";
import { useEffect } from "react";

export default function ReadingProgress() {
  const scrollProgress = useMotionValue(0);
  const scaleX = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const updateProgress = () => {
      const article = document.getElementById("main-article");

      // Fallback: jika artikel tidak ditemukan (misal di halaman lain), progress 0
      if (!article) {
        scrollProgress.set(0);
        return;
      }

      const rect = article.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const articleTop = rect.top + scrollTop;
      const articleHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Start: Saat bagian atas artikel menyentuh bagian atas viewport
      // End: Saat bagian bawah artikel menyentuh bagian bawah viewport
      // Rumus: (scrollTop - start) / (end - start)

      const start = articleTop;
      const end = articleTop + articleHeight - viewportHeight;

      let p = (scrollTop - start) / (end - start);

      // Clamp 0-1
      if (p < 0) p = 0;
      if (p > 1) p = 1;

      scrollProgress.set(p);
    };

    window.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);

    // Initial calls fixes hydration mismatch
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [scrollProgress]);

  return (
    <m.div
      className="fixed top-0 left-0 right-0 h-1 bg-amber-500 z-[100] origin-left"
      style={{ scaleX }}
    />
  );
}
