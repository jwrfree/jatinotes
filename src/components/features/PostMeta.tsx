import { PortableTextContentNode } from "@/lib/types";
import { formatDateIndonesian, calculateReadingTime } from "@/lib/utils";

interface PostMetaProps {
  authorName?: string;
  date: string;
  post?: { wordCount?: number | null; content?: string | PortableTextContentNode[] | null };
  wordCount?: number;
  className?: string;
}

export default function PostMeta({
  authorName = "Wruhantojati",
  date,
  post,
  wordCount,
  className = ""
}: PostMetaProps) {
  const readingTime = post ? calculateReadingTime(post) : (wordCount ? Math.max(1, Math.ceil((wordCount / 5) / 200)) : 1);

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-zinc-600 dark:text-zinc-400 sm:gap-x-3 sm:text-xs ${className}`}>
      <span className="font-medium text-zinc-900 dark:text-zinc-100">{authorName}</span>
      <span className="text-zinc-400 dark:text-zinc-600">&bull;</span>
      <time dateTime={date} className="whitespace-nowrap text-zinc-600 dark:text-zinc-400">
        {formatDateIndonesian(date)}
      </time>
      <span className="text-zinc-400 dark:text-zinc-600">&bull;</span>
      <span className="whitespace-nowrap text-zinc-600 dark:text-zinc-400">
        bacaan {readingTime} menit
      </span>
    </div>
  );
}
