"use client";

import Link from "next/link";
import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { Post, Category } from "@/lib/types";
import PostCard from "@/components/features/PostCard";
import BackgroundOrnaments from "@/components/ui/BackgroundOrnaments";
import ScrollReveal3D from "@/components/ui/ScrollReveal3D";

interface BookSectionProps {
  category: Category | null;
}

export default function BookSection({ category }: BookSectionProps) {
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
    <section ref={containerRef} className="relative z-10 overflow-hidden py-24 sm:py-28">
      <BackgroundOrnaments variant="subtle" />

      <div className="relative mx-auto mb-10 max-w-7xl px-6 sm:mb-12">
        <m.div style={{ y: headingY, opacity: headingOpacity }}>
          <div className="mb-4 flex items-center gap-4">
            <span className="h-px w-12 bg-amber-500" />
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-500">
              Library
            </span>
          </div>

          <div className="flex flex-col items-end justify-between gap-6 md:flex-row">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
              Sudut <span className="text-amber-500">Bacaan</span>
            </h2>

            <Link
              href="/buku"
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
            >
              Lihat Rak Buku &rarr;
            </Link>
          </div>
        </m.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {category.posts.nodes.map((post: Post, i: number) => (
            <ScrollReveal3D
              key={post.id}
              rotateXFrom={-40}
              scaleFrom={0.88}
              yFrom={50}
              origin="bottom center"
              offset={["start end", "center center"]}
            >
              <PostCard post={post} variant="glass" />
            </ScrollReveal3D>
          ))}
        </div>
      </div>
    </section>
  );
}
