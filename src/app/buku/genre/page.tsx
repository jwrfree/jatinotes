import { getAllGenres } from "@/lib/api";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import ContentCard from "@/components/ContentCard";
import PageHeader from "@/components/PageHeader";
import BackgroundOrnaments from "@/components/BackgroundOrnaments";
import { MotionDiv, staggerContainer, fadeIn } from "@/components/Animations";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Genre Buku - Rak Buku Jati Notes",
  description: "Eksplorasi review buku berdasarkan kategori dan genre pilihan.",
  url: "/buku/genre",
});

export default async function GenreListPage() {
  const genres = await getAllGenres();

  return (
    <div className="relative overflow-hidden min-h-screen">
      <BackgroundOrnaments variant="warm" />
      
      <ContentCard maxWidth="max-w-6xl">
        <MotionDiv
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <PageHeader
            title="Genre Buku"
            subtitle="Pilih kategori yang ingin kamu jelajahi lebih dalam."
            topContent={
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-amber-500" />
                <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                  Categories
                </span>
              </div>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {genres.map((genre) => (
              <MotionDiv
                key={genre.id}
                variants={fadeIn}
                className="group relative"
              >
                <Link href={`/buku/genre/${genre.slug}`}>
                  <div className="h-full p-8 rounded-[2rem] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 transition-all duration-300 group-hover:bg-amber-50/50 dark:group-hover:bg-amber-900/10 group-hover:border-amber-200 dark:group-hover:border-amber-800/50 group-hover:shadow-xl group-hover:shadow-amber-500/5">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen size={24} />
                      </div>
                      <span className="text-4xl font-black text-zinc-200 dark:text-zinc-800 group-hover:text-amber-200 dark:group-hover:text-amber-900/30 transition-colors duration-300">
                        {genre.count?.toString().padStart(2, '0')}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {genre.name}
                    </h3>
                    
                    {genre.description && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {genre.description}
                      </p>
                    )}
                    
                    <div className="mt-8 flex items-center text-sm font-bold text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                      Lihat Semua Review
                      <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      </ContentCard>
    </div>
  );
}
