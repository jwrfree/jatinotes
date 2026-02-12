import Link from "next/link";
import { Post, Category } from "@/lib/types";
import PostCard from "@/components/features/PostCard";

interface TechSectionProps {
  category: Category | null;
}

export default function TechSection({ category }: TechSectionProps) {
  if (!category || !category.posts?.nodes || category.posts.nodes.length === 0) {
    return null;
  }

  return (
    <section className="relative z-20 py-32 overflow-hidden bg-white dark:bg-zinc-950">
      <div className="absolute inset-0 bg-amber-500/[0.02] dark:bg-amber-500/[0.01]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      {/* Fade out to reveal next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-white dark:from-zinc-950 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Teknologi & <span className="text-amber-500">Kode</span>
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
              Catatan teknis seputar pengembangan web, eksperimen coding, dan tool favorit.
            </p>
          </div>
          
          <Link 
            href="/teknologi" 
            className="group inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-full text-sm font-medium text-zinc-900 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            Lihat Semua
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {category.posts.nodes.map((post: Post) => (
            <PostCard key={post.id} post={post} variant="tech" customAspectRatio="aspect-[3/2]" />
          ))}
        </div>
      </div>
    </section>
  );
}
