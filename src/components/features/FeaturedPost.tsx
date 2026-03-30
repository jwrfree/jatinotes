'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { Post } from '@/lib/types';
import { sanitize } from '@/lib/sanitize';
import { MotionDiv, fadeIn } from '@/components/ui/Animations';
import { calculateReadingTime, formatDateIndonesian } from '@/lib/utils';

interface FeaturedPostProps {
  post: Post;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const displayTitle = (post.title || "Untitled").replace(/[â€œâ€]/g, '"');
  const primaryCategory = post.categories?.nodes.find(
    (category) => !["blog", "buku", "teknologi"].includes(category.slug)
  ) || post.categories?.nodes[0];

  return (
    <section className="relative">
      <MotionDiv
        ref={containerRef}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="group relative overflow-hidden rounded-[2rem] bg-zinc-100 shadow-2xl shadow-black/5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-amber-500/10 dark:bg-zinc-900"
      >
        <Link href={`/posts/${post.slug}`} className="relative block aspect-[16/10] w-full overflow-hidden md:aspect-[2.1/1]">
          {post.featuredImage?.node?.sourceUrl && (
            <m.div
              style={{ y, height: "120%", top: "-10%" }}
              className="relative h-full w-full"
            >
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.title || ''}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
              />
            </m.div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5 opacity-95" />

          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
            <div className="relative m-5 md:m-8">
              <div className="max-w-3xl rounded-[1.75rem] border border-white/15 bg-black/30 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-500 md:p-7">
                <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-zinc-100/90">
                  {primaryCategory && (
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                      {primaryCategory.name}
                    </span>
                  )}
                  <span>{formatDateIndonesian(post.date)}</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>{calculateReadingTime(post)} menit baca</span>
                </div>
                <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white transition-colors duration-500 group-hover:text-amber-300 md:text-4xl">
                  {displayTitle}
                </h2>
                <div
                  className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-100/90 line-clamp-3 md:text-base"
                  dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt || "") }}
                />
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/95 transition-colors duration-300 group-hover:text-amber-200">
                  Baca catatan pilihan
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </MotionDiv>
    </section>
  );
}
