import Link from "next/link";
import { Post } from "@/lib/types";
import { calculateReadingTime, formatDateIndonesian } from "@/lib/utils";
import { sanitize } from "@/lib/sanitize";
import { MotionDiv, fadeIn } from "@/components/ui/Animations";

interface PostListItemProps {
  post: Post;
}

export default function PostListItem({ post }: PostListItemProps) {
  const primaryCategory = post.categories?.nodes.find(
    (category) => !["blog", "buku", "teknologi"].includes(category.slug)
  ) || post.categories?.nodes[0];

  return (
    <MotionDiv
      variants={fadeIn}
      className="group"
    >
      <Link
        href={`/posts/${post.slug}`}
        className="flex flex-col gap-5 rounded-[2rem] border border-zinc-200/70 bg-white/70 px-5 py-5 shadow-sm shadow-black/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 dark:border-zinc-800 dark:bg-zinc-900/65 md:px-7 md:py-6"
      >
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          {primaryCategory && (
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
              {primaryCategory.name}
            </span>
          )}
          <span>{formatDateIndonesian(post.date)}</span>
          <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span>{calculateReadingTime(post)} menit baca</span>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-medium leading-tight text-zinc-900 transition-colors group-hover:text-amber-500 dark:text-zinc-100 sm:font-semibold md:text-[1.7rem]">
              {post.title}
            </h3>
            <div
              className="max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2 md:text-[15px]"
              dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt || "") }}
            />
          </div>
          <div className="flex items-center gap-2 text-amber-500 md:ml-8">
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Baca Catatan</span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
}
