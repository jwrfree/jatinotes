import Link from "next/link";
import Image from "next/image";
import { MotionDiv, fadeIn } from "@/components/Animations";
import { Post } from "@/lib/types";
import { calculateReadingTime } from "@/lib/utils";

interface BookArchiveCardProps {
  post: Post;
}

export default function BookArchiveCard({ post }: BookArchiveCardProps) {
  return (
    <MotionDiv
      variants={fadeIn}
      className="group"
    >
      <Link href={`/posts/${post.slug}`} className="block space-y-6">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all duration-500 group-hover:border-primary/20 group-hover:shadow-lg">
          {post.featuredImage?.node?.sourceUrl ? (
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.title}
              fill
              className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-200 dark:text-zinc-800">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-primary transition-colors">
            {post.categories?.nodes?.find(c => c.slug !== 'buku')?.name || 'Book'}
          </div>
          <h4 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 leading-snug line-clamp-2 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
            {post.title}
          </h4>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase">
            <span>{calculateReadingTime(post.content || "")} min read</span>
            <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-primary">
              Details <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
}
