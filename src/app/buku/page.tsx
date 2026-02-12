import { getPostsByCategory, getAllGenres } from "@/lib/api";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Book, BookOpen, Quote } from "lucide-react";
import { constructMetadata } from "@/lib/metadata";
import { getBookTitle, getBookAuthor } from "@/lib/book-utils";
import { Post } from "@/lib/types";

export const metadata: Metadata = constructMetadata({
  title: "Rak Buku",
  description: "Menjelajahi dunia lewat kata-kata. Kumpulan ulasan buku dari pengembangan diri hingga fiksi yang melembutkan hati.",
  url: "/buku",
});

// Revalidate every hour
export const revalidate = 3600;

// Helper Component for Asymmetric Grid Card
function AsymmetricBookCard({ post, isWide = false }: { post: Post; isWide?: boolean }) {
  if (!post) return null;

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`group relative overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 block h-full w-full`}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {post.featuredImage?.node?.sourceUrl ? (
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            sizes={isWide ? "(max-width: 768px) 100vw, 800px" : "(max-width: 768px) 100vw, 400px"}
          />
        ) : (
          <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
            <BookOpen className="text-zinc-400 w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 from-10% via-black/50 via-30% to-transparent to-70% opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end h-full">
        <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
          <h3 className={`font-bold text-white leading-tight mb-2 ${isWide ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
            {getBookTitle(post)}
          </h3>
          <p className="text-white/70 font-medium text-sm mb-4">
            {getBookAuthor(post)}
          </p>

          {isWide && (
            <p className="text-white/80 text-sm line-clamp-2 md:line-clamp-none max-w-2xl hidden md:block">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Simple Grid Card for Latest 3
function SimpleBookCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <div className="aspect-[2/3] relative overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800 mb-4 border border-zinc-100 dark:border-zinc-800">
        {post.featuredImage?.node?.sourceUrl ? (
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Book size={24} className="text-zinc-400" />
          </div>
        )}
      </div>
      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-amber-600 transition-colors">
        {getBookTitle(post)}
      </h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
        {getBookAuthor(post)}
      </p>
    </Link>
  );
}

export default async function BukuPage() {
  // Fetch data concurrently
  const [latestData, selfHelpData, fictionData, genres] = await Promise.all([
    getPostsByCategory("buku", { first: 4 }), // 1 Hero + 3 latest grid
    getPostsByCategory("pengembangan-diri", { first: 4 }), // 4 for asymmetric grid
    getPostsByCategory("fiksi", { first: 4 }), // 4 for asymmetric grid (Note: check slug if 'fiksi' or 'novel')
    getAllGenres()
  ]);

  const latestPosts = latestData?.posts?.nodes || [];
  const selfHelpPosts = selfHelpData?.posts?.nodes || [];
  const fictionPosts = fictionData?.posts?.nodes || [];

  const heroPost = latestPosts[0];
  const gridPosts = latestPosts.slice(1, 4);

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] dark:bg-zinc-950 transition-colors duration-500">

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-amber-100/30 dark:bg-amber-900/10 blur-[150px] rounded-full opacity-50" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-100/30 dark:bg-blue-900/10 blur-[150px] rounded-full opacity-50" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32 pb-24 space-y-24 sm:space-y-32">

        {/* === 1. HERO SECTION === */}
        <section>
          {/* Header Typography */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-amber-500" />
              <span className="text-xs font-medium uppercase tracking-widest text-amber-600 dark:text-amber-500">
                The Library
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Rak Buku
            </h1>
          </header>

          {/* Hero Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Featured Book (Left - 7 cols) */}
            <div className="lg:col-span-7">
              {heroPost && (
                <Link href={`/posts/${heroPost.slug}`} className="group block relative h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl">
                  {heroPost.featuredImage?.node?.sourceUrl && (
                    <Image
                      src={heroPost.featuredImage.node.sourceUrl}
                      alt={heroPost.title}
                      fill
                      className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 sm:p-10 max-w-2xl">
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/50 backdrop-blur-md rounded-full border border-amber-500/20">
                      Featured Review
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                      {getBookTitle(heroPost)}
                    </h2>
                    <p className="text-lg text-white/80 font-medium mb-4">
                      by {getBookAuthor(heroPost)}
                    </p>
                    <p className="text-zinc-300 line-clamp-3 md:line-clamp-none mb-6 text-sm sm:text-base leading-relaxed hidden sm:block">
                      {heroPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-white font-bold text-sm group-hover:gap-4 transition-all">
                      Baca Selengkapnya <ArrowRight size={18} />
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Latest 3 Grid (Right - 5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                  <BookOpen size={20} className="text-amber-500" />
                  Baru Ditambahkan
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {gridPosts.map((post) => (
                    <SimpleBookCard key={post.id} post={post} />
                  ))}
                </div>
              </div>

              {/* Stats / Intro Blurb logic */}
              <div className="mt-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                <Quote size={24} className="text-amber-500 mb-3" />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-4">
                  Daftar buku yang sudah selesai dibaca dan diulas. Semoga ringkasannya bermanfaat.
                </p>
                <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <span>Total Koleksi</span>
                  <span>{genres.reduce((acc, g) => acc + (g.count || 0), 0)}+ Buku</span>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* === 2. SECTION: PENGEMBANGAN DIRI === */}
        {selfHelpPosts.length > 0 && (
          <section>
            <div className="mb-10">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2 block">Growth & Mindset</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-zinc-900 dark:text-white leading-tight">
                Aku suka membaca buku pengembangan diri karena ingin terus bertumbuh.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[320px] md:auto-rows-[380px]">
              {/* Row 1: 2/3 + 1/3 */}
              {selfHelpPosts[0] && (
                <div className="md:col-span-2 row-span-1">
                  <AsymmetricBookCard post={selfHelpPosts[0]} isWide={true} />
                </div>
              )}
              {selfHelpPosts[1] && (
                <div className="md:col-span-1 row-span-1">
                  <AsymmetricBookCard post={selfHelpPosts[1]} isWide={false} />
                </div>
              )}

              {/* Row 2: 1/3 + 2/3 */}
              {selfHelpPosts[2] && (
                <div className="md:col-span-1 row-span-1">
                  <AsymmetricBookCard post={selfHelpPosts[2]} isWide={false} />
                </div>
              )}
              {selfHelpPosts[3] && (
                <div className="md:col-span-2 row-span-1">
                  <AsymmetricBookCard post={selfHelpPosts[3]} isWide={true} />
                </div>
              )}
            </div>
          </section>
        )}


        {/* === 3. SECTION: FIKSI / NOVEL === */}
        {fictionPosts.length > 0 && (
          <section>
            <div className="mb-10">
              <span className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-2 block">Fiction & Stories</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-zinc-900 dark:text-white leading-tight">
                Novel memberiku kesempatan untuk berhenti sejenak dan melihat hidup dari sudut berbeda.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[320px] md:auto-rows-[380px]">
              {/* Row 1: 2/3 + 1/3 */}
              {fictionPosts[0] && (
                <div className="md:col-span-2 row-span-1">
                  <AsymmetricBookCard post={fictionPosts[0]} isWide={true} />
                </div>
              )}
              {fictionPosts[1] && (
                <div className="md:col-span-1 row-span-1">
                  <AsymmetricBookCard post={fictionPosts[1]} isWide={false} />
                </div>
              )}

              {/* Row 2: 1/3 + 2/3 */}
              {fictionPosts[2] && (
                <div className="md:col-span-1 row-span-1">
                  <AsymmetricBookCard post={fictionPosts[2]} isWide={false} />
                </div>
              )}
              {fictionPosts[3] && (
                <div className="md:col-span-2 row-span-1">
                  <AsymmetricBookCard post={fictionPosts[3]} isWide={true} />
                </div>
              )}
            </div>
          </section>
        )}


        {/* === 4. FOOTER: CATEGORY STATS === */}
        <section className="bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-8 sm:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Arsip Berdasarkan Kategori</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Jelajahi perpustakaan berdasarkan minat Anda.</p>
            </div>
            <Link
              href="/buku/semua"
              className="px-6 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors flex items-center gap-2"
            >
              Lihat Semua Koleksi <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {genres.map((genre) => (
              <Link
                key={genre.slug}
                href={`/buku/genre/${genre.slug}`}
                className="flex justify-between items-center p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all group"
              >
                <span className="font-semibold text-zinc-700 dark:text-zinc-200 group-hover:text-amber-600 transition-colors">{genre.name}</span>
                <span className="text-xs font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-md">{genre.count}</span>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
