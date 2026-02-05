'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Post } from '@/lib/types';
import { sanitize } from '@/lib/sanitize';
import { MotionDiv, fadeIn } from '@/components/Animations';

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

  return (
    <section className="mb-24">
      <MotionDiv
        ref={containerRef}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="group relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 shadow-2xl transition-all duration-500 hover:shadow-amber-500/5"
      >
        <Link href={`/posts/${post.slug}`} className="relative block aspect-[16/10] md:aspect-[2/1] w-full overflow-hidden">
          {post.featuredImage?.node?.sourceUrl && (
            <motion.div 
              style={{ y, height: "120%", top: "-10%" }}
              className="relative w-full h-full"
            >
                              <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.title || ''}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                />
            </motion.div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="relative m-6 md:m-10">
              <div className="md:max-w-[40%] backdrop-blur-2xl bg-white/10 dark:bg-black/40 p-6 md:p-8 rounded-xl shadow-2xl transition-all duration-500">
                <h2 className="text-xl md:text-3xl font-medium leading-tight text-white group-hover:text-amber-500 transition-colors duration-500 line-clamp-2 mb-4 tracking-tight">
                  {post.title.replace(/[“”]/g, '"')}
                </h2>
                <div
                  className="text-sm md:text-base leading-relaxed text-zinc-100 line-clamp-2 opacity-90"
                  dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt || "") }}
                />
              </div>
            </div>
          </div>
        </Link>
      </MotionDiv>
    </section>
  );
}
