
import { getHomeData } from "@/lib/services";
import { MotionDiv, staggerContainer } from "@/components/ui/Animations";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { Post } from "@/lib/types";
import PostListItem from "@/components/features/PostListItem";
import FeaturedPost from "@/components/features/FeaturedPost";
import HeroSection from "@/components/features/HeroSection";
import SectionHeading from "@/components/layout/SectionHeading";
import BackgroundOrnaments from "@/components/ui/BackgroundOrnaments";
import JsonLd from "@/components/features/JsonLd";
import TechSection from "@/components/features/TechSection";
import BookSection from "@/components/features/BookSection";

// ISR: Regenerate homepage every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = constructMetadata({
  title: "Jati Notes | Menata Isi Kepala Lewat Tulisan & Buku",
  description: "Catatan digital Wruhantojati tentang pengembangan web, desain UI/UX, dan perjalanan merapikan isi kepala.",
  url: "/",
});

export default async function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Jati Notes",
    "alternateName": ["JatiNotes", "Wruhantojati", "Jati Notes Blog"],
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
      <TechSection category={techCategory} />

      {/* Book Reviews Section - Horizontal Scroll */}
      <BookSection category={bookCategory} />
    </div>
  );
}
