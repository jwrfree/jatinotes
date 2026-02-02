import Link from "next/link";
import { Post } from "@/lib/types";
import { calculateReadingTime } from "@/lib/utils";
import { sanitize } from "@/lib/sanitize";
import { MotionDiv, fadeIn } from "@/components/Animations";

interface PostListItemProps {
  post: Post;
}

export default function PostListItem({ post }: PostListItemProps) {
  return (
    <MotionDiv
      variants={fadeIn}
      className="group"
    >
      <Link 
        href={`/posts/${post.slug}`}
        className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-zinc-100 dark:border-zinc-800 hover:border-amber-500/30 transition-colors"
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-400">
            <span>{calculateReadingTime(post.content || "")} menit baca</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
            {post.title}
          </h3>
          <div 
            className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt || "") }}
          />
        </div>
        <div className="mt-4 md:mt-0 md:ml-8 flex items-center gap-2 text-amber-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <span className="text-xs font-bold">Baca Catatan</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </Link>
    </MotionDiv>
  );
}
