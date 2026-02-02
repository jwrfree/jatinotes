import { formatDateIndonesian, calculateReadingTime } from "@/lib/utils";

interface PostMetaProps {
  authorName?: string;
  date: string;
  content: string;
  className?: string;
}

export default function PostMeta({ 
  authorName = "Wruhantojati", 
  date, 
  content, 
  className = "" 
}: PostMetaProps) {
  return (
    <div className={`flex flex-wrap items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 font-sans ${className}`}>
      <span className="font-normal tracking-wider">
        Oleh <span className="text-zinc-900 dark:text-zinc-100 font-normal">{authorName}</span> diterbitkan pada {formatDateIndonesian(date)}
      </span>
      <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
      <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full font-normal text-zinc-500 dark:text-zinc-400">
        {calculateReadingTime(content)} menit baca
      </span>
    </div>
  );
}
