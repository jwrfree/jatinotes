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
    <section className="mt-24 pt-16 border-t border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-px w-8 bg-amber-500" />
        <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest">
          Baca Juga
        </h2>
      </div>

      <MotionDiv
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
