import { getGenreBySlug, getAllGenres } from "@/lib/api";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import ContentCard from "@/components/ContentCard";
import PageHeader from "@/components/PageHeader";
import BackgroundOrnaments from "@/components/BackgroundOrnaments";
import { MotionDiv, staggerContainer, fadeIn } from "@/components/Animations";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, LayoutGrid } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const genre = await getGenreBySlug(slug);
  
  if (!genre) {
    return constructMetadata({
      title: "Genre Tidak Ditemukan",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `${genre.name} - Review Buku`,
    description: genre.description || `Koleksi review buku dalam genre ${genre.name}. Temukan ulasan mendalam dan rekomendasi buku terbaik.`,
    url: `/buku/genre/${slug}`,
  });
}

export default async function GenreDetailPage({ params }: Props) {
  const { slug } = await params;
  const [genre, allGenres] = await Promise.all([
    getGenreBySlug(slug),
    getAllGenres()
  ]);

  if (!genre) notFound();

  const posts = genre.posts?.nodes || [];

  return (
    <div className="relative overflow-hidden min-h-screen">
      <BackgroundOrnaments variant="warm" />
      
      <ContentCard maxWidth="max-w-7xl">
        <MotionDiv
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Link 
              href="/buku/genre"
              className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-amber-600 transition-colors"
            >
              <ChevronLeft size={16} />
              Semua Genre
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {genre.name}
            </span>
          </div>

          <PageHeader
            title={genre.name}
            subtitle={genre.description || `Menampilkan semua review buku dalam kategori ${genre.name}.`}
            topContent={
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-amber-500" />
                <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                  Genre Review
                </span>
              </div>
            }
          />

          {/* Quick Genre Switcher */}
          <div className="flex flex-wrap gap-2 mt-8 mb-16">
            <div className="flex items-center gap-2 mr-4 text-xs font-black uppercase tracking-widest text-zinc-400">
              <LayoutGrid size={14} />
              Lainnya:
            </div>
            {allGenres.filter(g => g.slug !== slug).slice(0, 6).map((g) => (
              <Link
                key={g.id}
                href={`/buku/genre/${g.slug}`}
                className="px-4 py-2 rounded-full text-xs font-bold bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
              >
                {g.name}
              </Link>
            ))}
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  variant="glass"
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center rounded-[3rem] bg-white/30 dark:bg-zinc-900/30 backdrop-blur-sm border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 dark:text-zinc-400">Belum ada review untuk genre ini.</p>
            </div>
          )}
        </MotionDiv>
      </ContentCard>
    </div>
  );
}
