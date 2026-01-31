import { getPostsByCategory } from "@/lib/api";
import { calculateReadingTime } from "@/lib/utils";
import { sanitize } from "@/lib/sanitize";
import Link from "next/link";
import { MotionDiv, MotionSection, fadeIn, staggerContainer } from "@/components/Animations";
import DecryptedText from "@/components/DecryptedText";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Post } from "@/lib/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Kumpulan artikel dan tutorial terbaru seputar teknologi dan desain.",
};

export default async function BlogListPage() {
  const category = await getPostsByCategory("blog");

  if (!category) {
    notFound();
  }

  const posts = category.posts?.nodes || [];

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Ornaments */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full" />
      </div>

      <MotionSection 
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="relative z-10 mx-auto max-w-5xl px-6 pt-28 sm:pt-40 pb-12 sm:pb-24"
      >
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-[3rem] shadow-2xl shadow-black/5 dark:shadow-white/5 p-8 sm:p-16">
          <header className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm font-bold text-primary">
                Koleksi Catatan
              </span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl mb-6">
              <DecryptedText 
                text="Blog"
                animateOn="view"
                revealDirection="start"
                sequential={true}
                useOriginalCharsOnly={false}
                className="text-zinc-900 dark:text-zinc-50"
                encryptedClassName="text-primary opacity-50"
              />
            </h1>
            
            {category.description && (
              <p className="max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {category.description}
              </p>
            )}
          </header>

          {posts.length > 0 ? (
            <MotionDiv 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-4"
            >
              {posts.map((post: Post) => (
                <MotionDiv
                  key={post.id}
                  variants={fadeIn}
                  className="group"
                >
                  <Link 
                    href={`/posts/${post.slug}`}
                    className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-zinc-100 dark:border-zinc-800 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-400">
                        <span>{calculateReadingTime(post.content || "")} menit baca</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <div 
                        className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt) }}
                      />
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-8 flex items-center gap-2 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <span className="text-xs font-bold">Baca Catatan</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Link>
                </MotionDiv>
              ))}
            </MotionDiv>
          ) : (
            <div className="p-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] text-center backdrop-blur-sm bg-white/5">
              <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">Belum Ada Catatan</h3>
              <p className="mt-2 text-zinc-500">Sedang menyusun pemikiran. Tulisan baru akan segera hadir.</p>
            </div>
          )}
        </div>
      </MotionSection>
    </div>
  );
}
