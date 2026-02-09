import { formatDateIndonesian, calculateReadingTime } from "@/lib/utils";

interface PostMetaProps {
  authorName?: string;
  date: string;
  post?: { wordCount?: number | null; content?: string | any[] | null }; // Post object with wordCount
  wordCount?: number; // Or direct wordCount
  className?: string;
}

export default function PostMeta({
  authorName = "Wruhantojati",
  date,
  post,
  wordCount,
  className = ""
}: PostMetaProps) {
  // Calculate reading time from post object or wordCount
  const readingTime = post ? calculateReadingTime(post) : (wordCount ? Math.max(1, Math.ceil((wordCount / 5) / 200)) : 1);

  return (
    <div className={`flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 text-xs text-zinc-500 dark:text-zinc-400 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="font-medium text-zinc-900 dark:text-zinc-100">{authorName}</span>
        <span className="hidden sm:inline w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
        <span className="sm:hidden text-zinc-400">•</span>
        <time dateTime={date} className="text-zinc-500 dark:text-zinc-400">
          {formatDateIndonesian(date)}
        </time>
      </div>
      <span className="hidden sm:inline w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
      <span className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full text-zinc-600 dark:text-zinc-400 w-fit">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
        </svg>
        {readingTime} menit
      </span>
    </div>
  );
}
