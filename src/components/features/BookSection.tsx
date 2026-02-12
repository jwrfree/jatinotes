import Link from "next/link";
import { Post, Category } from "@/lib/types";
import PostCard from "@/components/features/PostCard";
import BackgroundOrnaments from "@/components/ui/BackgroundOrnaments";
import DecryptedText from "@/components/ui/DecryptedText";

interface BookSectionProps {
  category: Category | null;
}

export default function BookSection({ category }: BookSectionProps) {
  if (!category || !category.posts?.nodes || category.posts.nodes.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 py-32 overflow-hidden">
      <BackgroundOrnaments variant="subtle" />
      
      <div className="relative mx-auto max-w-7xl px-6 mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="h-px w-12 bg-amber-500" />
          <span className="text-sm font-semibold text-amber-500 tracking-wider uppercase">Library</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Sudut <DecryptedText text="Bacaan" />
          </h2>
          
          <Link 
            href="/buku"
            className="text-sm font-medium text-zinc-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 transition-colors"
          >
            Lihat Rak Buku →
          </Link>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.posts.nodes.map((post: Post) => (
            <PostCard key={post.id} post={post} variant="glass" />
          ))}
        </div>
      </div>
    </section>
  );
}
