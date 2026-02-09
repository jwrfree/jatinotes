import { getPostsByCategory, getAllGenres } from "@/lib/api";
import { MotionDiv, staggerContainer, fadeIn } from "@/components/Animations";
import TypingText from "../../components/TypingText";
import { Metadata } from "next";
import PostCard from "@/components/PostCard";
import FeaturedPost from "@/components/FeaturedPost";
import Link from "next/link";
import { LayoutGrid, ListFilter, ArrowRight, BookOpen } from "lucide-react";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Rak Buku - Jati Notes",
  description: "Kumpulan ulasan dan catatan dari buku-buku yang telah saya baca. Temukan rekomendasi buku terbaik dan ringkasan pemikiran dari berbagai genre.",
  url: "/buku",
});

export default async function BukuPage() {
  const [categoryData, genres] = await Promise.all([
    getPostsByCategory("buku", { first: 50 }),
    getAllGenres()
  ]);

  const posts = categoryData?.posts?.nodes || [];

  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);
  const remainingPosts = posts.slice(3);

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] dark:bg-zinc-950 transition-colors duration-500">
      {/* Editorial Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[60%] bg-zinc-100/50 dark:bg-zinc-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] -left-[5%] w-[30%] h-[40%] bg-amber-500/5 dark:bg-amber-500/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24">
        {/* Editorial Header */}
        <header className="mb-12 sm:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 border-b border-zinc-200 dark:border-zinc-800 pb-8 sm:pb-12">
            <div className="max-w-3xl space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="h-[1px] w-8 sm:w-12 bg-amber-500" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-500">
                  The Library
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter leading-[0.85]">
                <TypingText text="Rak" /><br />
                <span className="text-amber-500/20 dark:text-amber-500/10">Buku</span>
              </h1>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <p className="text-left md:text-right max-w-full md:max-w-[280px] text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed italic">
                &quot;Sebuah ruangan tanpa buku adalah seperti tubuh tanpa jiwa.&quot; — Cicero
              </p>
              <div className="mt-4 sm:mt-8 flex items-center gap-3 sm:gap-4">
                <div className="h-10 sm:h-12 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums leading-none">
                    {posts.length.toString().padStart(2, '0')}
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    Curated Reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 1. FEATURED HERO */}
        {featuredPost && <FeaturedPost post={featuredPost} />}

        {/* Inline Genres & Quick Reviews Access */}
        <section className="mb-16 sm:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
            {/* Genre List - Left (7 cols) */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                <div className="p-2 sm:p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                  <LayoutGrid size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">Pilih Genre</h2>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Eksplorasi buku berdasarkan kategori.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {genres.map((genre) => (
                  <MotionDiv
                    key={genre.id}
                    variants={fadeIn}
                    className="group"
                  >
                    <Link href={`/buku/genre/${genre.slug}`}>
                      <div className="h-full p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 transition-all duration-300 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 hover:border-amber-200 dark:hover:border-amber-800/50 hover:shadow-lg hover:shadow-amber-500/5">
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <BookOpen size={16} className="sm:w-[18px] sm:h-[18px] text-amber-500/50 group-hover:text-amber-500 transition-colors" />
                          <span className="text-[10px] sm:text-xs font-black text-zinc-300 dark:text-zinc-700 group-hover:text-amber-500/30 transition-colors">
                            {genre.count?.toString().padStart(2, '0')}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                          {genre.name}
                        </h4>
                      </div>
                    </Link>
                  </MotionDiv>
                ))}
              </div>
            </div>

            {/* Quick Access All Reviews - Right (5 cols) */}
            <div className="lg:col-span-4">
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                    <ListFilter size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Arsip Lengkap</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Semua ulasan dalam satu daftar.</p>
                  </div>
                </div>

                <MotionDiv
                  variants={fadeIn}
                  className="group flex-grow"
                >
                  <Link href="/buku/reviews" className="h-full block">
                    <div className="h-full p-8 rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5 backdrop-blur-md border border-amber-200/50 dark:border-amber-800/30 transition-all duration-500 hover:from-amber-500/20 hover:to-orange-500/20 hover:shadow-2xl hover:shadow-amber-500/10 group-hover:-translate-y-1 flex flex-col justify-center text-center">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                        <ListFilter size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-tight">Semua Review</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-[200px] mx-auto italic">
                        &quot;Melihat perjalanan literasi dari waktu ke waktu.&quot;
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm font-black text-amber-600 dark:text-amber-400 group-hover:gap-4 transition-all duration-300">
                        BUKA ARSIP
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </Link>
                </MotionDiv>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SECONDARY GRID */}
        <section className="mb-16 sm:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {secondaryPosts.map((post, idx) => (
              <PostCard
                key={post.id}
                post={post}
                variant="glass"
                isWide={idx === 1}
              />
            ))}
          </div>
        </section>

        {/* 3. DENSE GRID */}
        <section>
          <MotionDiv
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {remainingPosts.map((post) => (
              <PostCard key={post.id} post={post} variant="glass" />
            ))}
          </MotionDiv>
        </section>
      </main>
    </div>
  );
}
