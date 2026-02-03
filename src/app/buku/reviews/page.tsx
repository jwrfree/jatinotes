import { getAllBookReviews } from "@/lib/api";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import ContentCard from "@/components/ContentCard";
import PageHeader from "@/components/PageHeader";
import BackgroundOrnaments from "@/components/BackgroundOrnaments";
import { MotionDiv, staggerContainer } from "@/components/Animations";
import Link from "next/link";

export const metadata: Metadata = constructMetadata({
  title: "Arsip Review Buku - Jati Notes",
  description: "Daftar lengkap ulasan buku yang telah dibaca dan diulas oleh Wruhantojati dalam format arsip terstruktur.",
  url: "/buku/reviews",
});

export default async function AllReviewsPage() {
  const { nodes: reviews } = await getAllBookReviews({ first: 100 });

  // Mapping penulis buku berdasarkan slug (Hardcoded sementara)
  const bookAuthors: Record<string, string> = {
    "kenapa-buku-quiet-bikin-aku-merasa-dimengerti": "Susan Cain",
    "why-we-sleep": "Matthew Walker",
    "sapiens-riwayat-singkat-umat-manusia": "Yuval Noah Harari",
    "review-buku-filosofi-teras-panduan-praktis-hidup-tenang-gen-z-milenial": "Henry Manampiring",
    "review-buku-the-danish-way-of-parenting": "Jessica Joelle Alexander & Iben Sandahl",
    "rich-dad-poor-dad-cara-mengelola-uang-yang-diajarkan-orang-kaya-ulasan-lengkap-buku-robert-kiyosaki": "Robert Kiyosaki",
    "strawberry-generation-generasi-rapuh-atau-adaptif": "Rhenald Kasali",
    "atomic-habits-james-clear": "James Clear",
    "mantappu-jiwa": "Jerome Polin",
    "filosofi-teras": "Henry Manampiring",
    "atomic-habits": "James Clear",
    "ikigai": "Héctor García & Francesc Miralles",
    "sapiens": "Yuval Noah Harari",
    "the-psychology-of-money": "Morgan Housel",
    "the-art-of-thinking-clearly": "Rolf Dobelli",
    "man-search-for-meaning": "Viktor E. Frankl",
    "show-your-work": "Austin Kleon",
    "steal-like-an-artist": "Austin Kleon",
    "keep-going": "Austin Kleon",
    "deep-work": "Cal Newport",
    "digital-minimalism": "Cal Newport",
    "the-alchemist": "Paulo Coelho",
    "dune": "Frank Herbert",
    "so-good-they-cant-ignore-you": "Cal Newport",
    "grit": "Angela Duckworth",
    "ego-is-the-enemy": "Ryan Holiday",
    "the-daily-stoic": "Ryan Holiday",
    "stillness-is-the-key": "Ryan Holiday",
    "the-subtle-art-of-not-giving-a-fck": "Mark Manson",
    "everything-is-fcked": "Mark Manson",
    "start-with-why": "Simon Sinek",
    "leaders-eat-last": "Simon Sinek",
    "think-again": "Adam Grant",
    "zero-to-one": "Peter Thiel",
    "the-lean-startup": "Eric Ries",
    "good-to-great": "Jim Collins",
    "filosofi-teras-henry-manampiring": "Henry Manampiring",
    // Tambahkan slug buku dan nama penulis di sini
  };

  // Mapping judul buku berdasarkan slug postingan (Hardcoded sementara)
  const bookTitles: Record<string, string> = {
    "kenapa-buku-quiet-bikin-aku-merasa-dimengerti": "Quiet",
    "why-we-sleep": "Why We Sleep",
    "sapiens-riwayat-singkat-umat-manusia": "Sapiens",
    "review-buku-filosofi-teras-panduan-praktis-hidup-tenang-gen-z-milenial": "Filosofi Teras",
    "review-buku-the-danish-way-of-parenting": "The Danish Way of Parenting",
    "rich-dad-poor-dad-cara-mengelola-uang-yang-diajarkan-orang-kaya-ulasan-lengkap-buku-robert-kiyosaki": "Rich Dad Poor Dad",
    "strawberry-generation-generasi-rapuh-atau-adaptif": "Strawberry Generation",
    "atomic-habits-james-clear": "Atomic Habits",
    "mantappu-jiwa": "Mantappu Jiwa",
    "filosofi-teras": "Filosofi Teras",
    "atomic-habits": "Atomic Habits",
    "ikigai": "Ikigai",
    "sapiens": "Sapiens",
    "the-psychology-of-money": "The Psychology of Money",
    "the-art-of-thinking-clearly": "The Art of Thinking Clearly",
    "man-search-for-meaning": "Man's Search for Meaning",
    "show-your-work": "Show Your Work!",
    "steal-like-an-artist": "Steal Like an Artist",
    "keep-going": "Keep Going",
    "deep-work": "Deep Work",
    "digital-minimalism": "Digital Minimalism",
    "the-alchemist": "The Alchemist",
    "dune": "Dune",
    "so-good-they-cant-ignore-you": "So Good They Can't Ignore You",
    "grit": "Grit",
    "ego-is-the-enemy": "Ego is the Enemy",
    "the-daily-stoic": "The Daily Stoic",
    "stillness-is-the-key": "Stillness is the Key",
    "the-subtle-art-of-not-giving-a-fck": "The Subtle Art of Not Giving a F*ck",
    "everything-is-fcked": "Everything is F*cked",
    "start-with-why": "Start with Why",
    "leaders-eat-last": "Leaders Eat Last",
    "think-again": "Think Again",
    "zero-to-one": "Zero to One",
    "the-lean-startup": "The Lean Startup",
    "good-to-great": "Good to Great",
    "filosofi-teras-henry-manampiring": "Filosofi Teras",
    // Tambahkan mapping judul buku di sini
  };

  // Fungsi untuk membersihkan judul postingan jika tidak ada di mapping
  const getBookTitle = (slug: string, title: string) => {
    if (bookTitles[slug]) return bookTitles[slug];
    
    return title
      .replace(/Review Buku\s*:/i, '')
      .replace(/Review Buku\s*/i, '')
      .replace(/Review\s*:/i, '')
      .replace(/Buku\s*:/i, '')
      .replace(/^Kenapa Buku\s+/i, '')
      .replace(/\s+Bikin Aku.*$/i, '')
      .trim();
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
            title="Arsip Review"
            subtitle="Daftar lengkap ulasan buku dalam format yang ringkas dan terstruktur."
            topContent={
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-amber-500" />
                <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                  The Library Archive
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
                            {getBookTitle(post.slug, post.title)}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 lg:hidden">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {bookAuthors[post.slug] || (post.tags?.nodes.length ? post.tags.nodes[0].name : 'Penulis belum diisi')}
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
                        {bookAuthors[post.slug] || (post.tags?.nodes.length ? post.tags.nodes[0].name : '-')}
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
