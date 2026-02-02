import Link from "next/link";
import Image from "next/image";
import { MotionDiv, fadeIn } from "@/components/Animations";
import { Post } from "@/lib/types";
import { sanitize } from "@/lib/sanitize";
import { calculateReadingTime } from "@/lib/utils";

interface BookHeroProps {
  post: Post;
}

export default function BookHero({ post }: BookHeroProps) {
  return (
    <section className="mb-32">
      <MotionDiv 
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center bg-white dark:bg-zinc-900/50 p-8 lg:p-12 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl"
      >
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">
              Featured Review
            </div>
            <Link href={`/posts/${post.slug}`} className="block group">
              <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-100 leading-[1.1] tracking-tight group-hover:text-primary transition-colors">
                {post.title}
              </h2>
            </Link>
            <div 
              className="text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-serif line-clamp-3 italic"
              dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt || "") }}
            />
            <div className="flex flex-wrap items-center gap-6">
              <Link 
                href={`/posts/${post.slug}`}
                className="h-14 px-8 flex items-center justify-center bg-primary text-white text-sm font-bold uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                Read Full Review
              </Link>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                {calculateReadingTime(post.content || "")} Min Insight
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 order-1 lg:order-2">
          <Link href={`/posts/${post.slug}`} className="block group relative">
            <div className="relative aspect-[3/4] w-full max-w-[400px] mx-auto overflow-hidden rounded-[2rem] shadow-2xl transition-transform duration-700 group-hover:-translate-y-2">
              {post.featuredImage?.node?.sourceUrl ? (
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </Link>
        </div>
      </MotionDiv>
    </section>
  );
}
