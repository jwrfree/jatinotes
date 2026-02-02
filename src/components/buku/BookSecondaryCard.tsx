import Link from "next/link";
import Image from "next/image";
import { MotionDiv, fadeIn } from "@/components/Animations";
import { Post } from "@/lib/types";
import { sanitize } from "@/lib/sanitize";
import { calculateReadingTime } from "@/lib/utils";

interface BookSecondaryCardProps {
  post: Post;
  idx: number;
}

export default function BookSecondaryCard({ post, idx }: BookSecondaryCardProps) {
  return (
    <MotionDiv
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className={`flex flex-col ${idx % 2 === 1 ? 'md:pt-16' : ''}`}
    >
      <Link href={`/posts/${post.slug}`} className="group relative mb-8">
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-lg group-hover:shadow-xl transition-all duration-500">
          {post.featuredImage?.node?.sourceUrl && (
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.title}
              fill
              className="object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
      <div className="space-y-4 px-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            {post.categories?.nodes?.find(c => c.slug !== 'buku')?.name || 'Literature'}
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {calculateReadingTime(post.content || "")} min
          </span>
        </div>
        <Link href={`/posts/${post.slug}`} className="block group/title">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 leading-tight group-hover/title:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        <div 
          className="text-base text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt || "") }}
        />
      </div>
    </MotionDiv>
  );
}
