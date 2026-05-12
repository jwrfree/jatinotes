"use client";

import Link from "next/link";
import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { Post, Category } from "@/lib/types";
import PostCard from "@/components/features/PostCard";
import ScrollReveal3D from "@/components/ui/ScrollReveal3D";

interface TechSectionProps {
  category: Category | null;
}

export default function TechSection({ category }: TechSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  if (!category || !category.posts?.nodes || category.posts.nodes.length === 0) {
    return null;
  }

  return (
    <section ref={containerRef} className="relative z-20 overflow-hidden bg-white py-24 dark:bg-zinc-950 sm:py-28">
      <div className="absolute inset-0 bg-amber-500/[0.02] dark:bg-amber-500/[0.01]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-white dark:from-zinc-950 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <m.div
          className="mb-14 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end"
          style={{ y: headingY, opacity: headingOpacity }}
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
              Teknologi & <span className="text-amber-500">Kode</span>
            </h2>
            <p className="mt-3 max-w-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Catatan teknis seputar pengembangan web, eksperimen coding, dan tool favorit.
            </p>
          </div>

          <Link
            href="/teknologi"
            className="group inline-flex items-center gap-2 rounded-full bg-zinc-100 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Lihat Semua
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </m.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {category.posts.nodes.map((post: Post, i: number) => (
            <ScrollReveal3D
              key={post.id}
              rotateXFrom={-40}
              scaleFrom={0.88}
              yFrom={50}
              origin="bottom center"
              offset={["start end", "center center"]}
            >
              <PostCard post={post} variant="tech" customAspectRatio="aspect-[3/2]" />
            </ScrollReveal3D>
          ))}
        </div>
      </div>
    </section>
  );
}
