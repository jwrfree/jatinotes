import { getAllBookReviews } from "@/lib/api";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import ContentCard from "@/components/ContentCard";
import PageHeader from "@/components/PageHeader";
import BackgroundOrnaments from "@/components/BackgroundOrnaments";
import { MotionDiv, staggerContainer } from "@/components/Animations";
import Link from "next/link";

export const metadata: Metadata = constructMetadata({
  title: "Daftar Buku - Jati Notes",
  description: "Daftar lengkap buku yang telah dibaca oleh Wruhantojati dalam format tabel yang ringkas dan terstruktur.",
  url: "/buku/semua",
});

// Revalidate every 60 seconds to ensure fresh data from Sanity
export const revalidate = 60;


export default async function AllReviewsPage() {
  const { nodes: reviews } = await getAllBookReviews({ first: 100 });

  // Fungsi untuk mendapatkan judul buku
  // Prioritas: bookTitle field > mapping > clean title
  const getBookTitle = (post: any) => {
    // 1. Gunakan bookTitle field jika ada
    if (post.bookTitle) return post.bookTitle;

    // 2. Fallback ke mapping lama (untuk backward compatibility)
    const bookTitles: Record<string, string> = {
      "kenapa-buku-quiet-bikin-aku-merasa-dimengerti": "Quiet",
      "why-we-sleep": "Why We Sleep",
      "sapiens-riwayat-singkat-umat-manusia": "Sapiens",
      "review-buku-filosofi-teras-panduan-praktis-hidup-tenang-gen-z-milenial": "Filosofi Teras",
      "rich-dad-poor-dad-cara-mengelola-uang-yang-diajarkan-orang-kaya-ulasan-lengkap-buku-robert-kiyosaki": "Rich Dad Poor Dad",
      "strawberry-generation-generasi-rapuh-atau-adaptif": "Strawberry Generation",
    };

    if (bookTitles[post.slug]) return bookTitles[post.slug];

    // 3. Clean title dari post title
    return post.title
      .replace(/Review Buku\s*:/i, '')
      .replace(/Review Buku\s*/i, '')
      .replace(/Review\s*:/i, '')
      .replace(/Buku\s*:/i, '')
      .replace(/^Kenapa Buku\s+/i, '')
      .replace(/\s+Bikin Aku.*$/i, '')
      .trim();
  };

  // Fungsi untuk mendapatkan pengarang buku
  // Prioritas: bookAuthor field > mapping > tags > placeholder
  const getBookAuthor = (post: any) => {
    // 1. Gunakan bookAuthor field jika ada
    if (post.bookAuthor) return post.bookAuthor;

    // 2. Fallback ke mapping lama (untuk backward compatibility)
    const bookAuthors: Record<string, string> = {
      "kenapa-buku-quiet-bikin-aku-merasa-dimengerti": "Susan Cain",
      "why-we-sleep": "Matthew Walker",
      "sapiens-riwayat-singkat-umat-manusia": "Yuval Noah Harari",
      "review-buku-filosofi-teras-panduan-praktis-hidup-tenang-gen-z-milenial": "Henry Manampiring",
      "rich-dad-poor-dad-cara-mengelola-uang-yang-diajarkan-orang-kaya-ulasan-lengkap-buku-robert-kiyosaki": "Robert Kiyosaki",
      "strawberry-generation-generasi-rapuh-atau-adaptif": "Rhenald Kasali",
    };

    if (bookAuthors[post.slug]) return bookAuthors[post.slug];

    // 3. Fallback ke tags atau placeholder
    return post.tags?.nodes.length ? post.tags.nodes[0].name : 'Penulis belum diisi';
  };

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
            title="Daftar Buku"
            subtitle="Semua buku yang telah dibaca dalam format tabel yang ringkas dan terstruktur."
            topContent={
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-amber-500" />
                <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                  The Library
                </span>
              </div>
            }
          />

          <div className="mt-16 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold tracking-tight text-zinc-400 dark:text-zinc-600">
                  <th className="pb-8 pl-4">Tanggal</th>
                  <th className="pb-8">Judul Buku</th>
                  <th className="pb-8 hidden lg:table-cell">Penulis</th>
                  <th className="pb-8 hidden md:table-cell">Genre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {reviews.map((post) => (
                  <tr
                    key={post.id}
                    className="group hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors duration-300"
                  >
                    <td className="py-6 pl-4 align-top">
                      <div className="text-xs font-medium text-zinc-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-6 align-top">
                      <Link href={`/posts/${post.slug}`} className="block">
                        <div>
                          <h3 className="text-sm md:text-base font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
                            {getBookTitle(post)}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 lg:hidden">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {getBookAuthor(post)}
                            </span>
                            <span className="text-zinc-300 dark:text-zinc-700 md:hidden">•</span>
                            <div className="flex items-center gap-2 md:hidden">
                              {post.categories?.nodes.filter(c => c.slug !== 'buku').slice(0, 1).map((cat) => (
                                <span key={cat.slug} className="text-xs font-medium text-amber-600/60">
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-6 align-top hidden lg:table-cell">
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {getBookAuthor(post)}
                      </div>
                    </td>
                    <td className="py-6 align-top hidden md:table-cell pr-4 text-right md:text-left">
                      <div className="flex flex-wrap gap-2 md:justify-start justify-end">
                        {post.categories?.nodes.filter(c => c.slug !== 'buku').map((cat) => (
                          <span
                            key={cat.slug}
                            className="text-xs font-medium text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reviews.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-zinc-500 dark:text-zinc-400">Belum ada review yang tersedia.</p>
              </div>
            )}
          </div>
        </MotionDiv>
      </ContentCard>
    </div>
  );
}
