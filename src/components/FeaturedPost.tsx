'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';
import { sanitize } from '@/lib/sanitize';
import { MotionDiv, fadeIn } from '@/components/Animations';

interface FeaturedPostProps {
  post: Post;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="space-y-12">
      <MotionDiv
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl transition-all duration-500 hover:shadow-primary/5"
      >
        <Link href={`/posts/${post.slug}`} className="relative block aspect-[3/2] w-full overflow-hidden">
          {post.featuredImage?.node?.sourceUrl && (
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.title || ''}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8">
            <div className="w-fit max-w-[50%] backdrop-blur-xl bg-white/10 dark:bg-black/30 p-4 md:p-5 rounded-2xl shadow-2xl transform transition-transform duration-500 group-hover:-translate-y-2">
              <h2 className="text-lg md:text-2xl font-medium leading-tight text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {post.title}
              </h2>
              <div
                className="mt-3 text-xs md:text-sm leading-relaxed text-zinc-300 line-clamp-2 opacity-90"
                dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt) }}
              />
            </div>
          </div>
        </Link>
      </MotionDiv>
    </div>
  );
}
