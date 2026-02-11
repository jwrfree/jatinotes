
import { getHomeData } from "@/lib/services";
import { MotionDiv, staggerContainer } from "@/components/Animations";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { Post } from "@/lib/types";
import PostListItem from "@/components/PostListItem";
import FeaturedPost from "@/components/FeaturedPost";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import BookCategoryStack from "@/components/BookCategoryStack";
import BackgroundOrnaments from "@/components/BackgroundOrnaments";
import DecryptedText from "@/components/DecryptedText";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";

// ISR: Regenerate homepage every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = constructMetadata({
  title: "Jati Notes | Eksplorasi Teknologi & Desain",
  description: "Catatan digital Wruhantojati tentang pengembangan web, desain UI/UX, dan teknologi terbaru menggunakan Headless WordPress.",
  url: "/",
});

export default async function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Jati Notes",
    "alternateName": ["JatiNotes", "Wruhanto Jati", "Jati Notes Blog"],
    "url": "https://jatinotes.com",
    "description": "Catatan digital Wruhantojati tentang pengembangan web, desain UI/UX, dan teknologi terbaru.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://jatinotes.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Jati Notes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jatinotes.com/icon.svg"
      }
    },
    "hasPart": [
      {
        "@type": "SiteNavigationElement",
        "name": "Buku",
        "url": "https://jatinotes.com/buku"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Blog",
        "url": "https://jatinotes.com/blog"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Meet Jati",
        "url": "https://jatinotes.com/meet-jati"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Teknologi",
        "url": "https://jatinotes.com/teknologi"
      }
    ]
  };

  const { posts, blogCategory, techCategory, bookCategory } = await getHomeData();

  return (
    <div className="relative min-h-screen">
      <JsonLd data={jsonLd} />

      <BackgroundOrnaments />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        {posts && posts.length > 0 ? (
          <div className="space-y-16">
            {/* Featured Post */}
            <FeaturedPost post={posts[0]} />

            {/* General Grid (Blog Category Only) */}
            {blogCategory && posts && posts.length > 0 && (
              <div className="space-y-12">
                <SectionHeading>
                  Saya menulis untuk mengabadikan apa yang melintas di pikiran dan membagikannya kepada dunia.
                </SectionHeading>

                <MotionDiv
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-4"
                >
                  {posts.slice(1).map((post: Post) => (
                    <PostListItem key={post.id} post={post} />
                  ))}
                </MotionDiv>
              </div>
            )}
          </div>
        ) : (
          <div className="p-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] text-center">
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">Belum Ada Catatan</h3>
            <p className="mt-2 text-zinc-500">Sedang menyusun pemikiran. Tulisan baru akan segera hadir.</p>
          </div>
        )}
      </section>

      {/* Technology Section with Thematic Accent */}
      {techCategory && techCategory.posts?.nodes && techCategory.posts.nodes.length > 0 && (
        <section className="relative z-20 py-32 overflow-hidden bg-white dark:bg-zinc-950">
          <div className="absolute inset-0 bg-amber-500/[0.02] dark:bg-amber-500/[0.01]" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

          {/* Fade out to reveal next section */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-white dark:from-zinc-950 to-transparent pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Teknologi & <span className="text-amber-500">Kode</span>
                </h2>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
                  Catatan teknis seputar pengembangan web, eksperimen coding, dan tool favorit.
                </p>
              </div>
              
              <Link 
                href="/teknologi" 
                className="group inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-full text-sm font-medium text-zinc-900 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                Lihat Semua
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {techCategory.posts.nodes.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Book Reviews Section - Horizontal Scroll */}
      {bookCategory && bookCategory.posts?.nodes && bookCategory.posts.nodes.length > 0 && (
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

          <div className="relative w-full overflow-x-hidden">
            {/* Gradient Masks for Scroll Hint */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-amber-50/80 dark:from-zinc-950 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-amber-50/80 dark:from-zinc-950 to-transparent z-20 pointer-events-none" />
            
            <BookCategoryStack posts={bookCategory.posts.nodes} />
          </div>
        </section>
      )}
    </div>
  );
}
