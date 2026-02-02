import { getPostsByCategory } from "@/lib/api";
import { MotionDiv, staggerContainer } from "@/components/Animations";
import TypingText from "../../components/TypingText";
import { Metadata } from "next";
import BookHero from "@/components/buku/BookHero";
import BookSecondaryCard from "@/components/buku/BookSecondaryCard";
import BookArchiveCard from "@/components/buku/BookArchiveCard";

export const metadata: Metadata = {
  title: "Rak Buku - Jati Notes",
  description: "Kumpulan ulasan dan catatan dari buku-buku yang telah saya baca.",
};

export default async function BukuPage() {
  const categoryData = await getPostsByCategory("buku", { first: 50 });
  const posts = categoryData?.posts?.nodes || [];
  
  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);
  const remainingPosts = posts.slice(3);

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] dark:bg-zinc-950 transition-colors duration-500">
      {/* Editorial Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[60%] bg-zinc-100/50 dark:bg-zinc-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] -left-[5%] w-[30%] h-[40%] bg-primary/5 dark:bg-primary/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-24">
        {/* Editorial Header */}
        <header className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-200 dark:border-zinc-800 pb-12">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-12 bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  The Library
                </span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter leading-[0.85]">
                <TypingText text="Rak" /><br />
                <span className="text-primary/20 dark:text-primary/10">Buku</span>
              </h1>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-right max-w-[280px] text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed italic">
                &quot;Sebuah ruangan tanpa buku adalah seperti tubuh tanpa jiwa.&quot; — Cicero
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
                <div className="text-left">
                  <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums leading-none">
                    {posts.length.toString().padStart(2, '0')}
                  </div>
                  <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    Curated Reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 1. FEATURED HERO */}
        {featuredPost && <BookHero post={featuredPost} />}

        {/* 2. SECONDARY GRID */}
        <section className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {secondaryPosts.map((post, idx) => (
              <BookSecondaryCard key={post.id} post={post} idx={idx} />
            ))}
          </div>
        </section>

        {/* 3. DENSE GRID */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-400">Archive & More</h2>
            <div className="h-[1px] flex-grow bg-zinc-100 dark:bg-zinc-900" />
          </div>
          
          <MotionDiv 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16"
          >
            {remainingPosts.map((post) => (
              <BookArchiveCard key={post.id} post={post} />
            ))}
          </MotionDiv>
        </section>
      </main>
    </div>
  );
}
