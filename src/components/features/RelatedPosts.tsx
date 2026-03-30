"use client";

import { Post } from "@/lib/types";
import PostCard from "./PostCard";
import { MotionDiv, fadeIn, staggerContainer } from "@/components/ui/Animations";

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-10 rounded-[2.25rem] border border-zinc-200/70 bg-gradient-to-br from-white/90 via-white/75 to-amber-50/60 p-6 shadow-xl shadow-black/5 backdrop-blur-md dark:border-zinc-800 dark:from-zinc-900/90 dark:via-zinc-900/75 dark:to-zinc-950 sm:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-px w-10 bg-amber-500" />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-500">
          Baca Juga
        </h2>
      </div>
      <div className="mb-8 max-w-2xl">
        <h3 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Kalau tulisan ini terasa dekat, mungkin yang berikut juga akan pas.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
          Beberapa catatan ini membahas tema yang mirip, jadi kamu bisa lanjut membaca dari sini.
        </p>
      </div>

      <MotionDiv
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {posts.map((post) => (
          <MotionDiv key={post.id} variants={fadeIn}>
            <PostCard
              post={post}
              variant="minimal"
              customAspectRatio="aspect-video"
            />
          </MotionDiv>
        ))}
      </MotionDiv>
    </section>
  );
}
