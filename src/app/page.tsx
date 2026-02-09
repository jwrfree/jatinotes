import { getHomeData } from "@/lib/services";
import Link from "next/link";
import Image from "next/image";
import { MotionDiv, staggerContainer } from "@/components/Animations";
import { LazyMotionWrapper, LazyMotionDiv } from "@/components/LazyMotion";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";
import PostListItem from "@/components/PostListItem";
import FeaturedPost from "@/components/FeaturedPost";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import BookCategoryStack from "@/components/BookCategoryStack";
import BackgroundOrnaments from "@/components/BackgroundOrnaments";
import DecryptedText from "@/components/DecryptedText";
import JsonLd from "@/components/JsonLd";

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
    "url": "https://jatinotes.com",
    "description": "Catatan digital Wruhantojati tentang pengembangan web, desain UI/UX, dan teknologi terbaru.",
    "publisher": {
      "@type": "Organization",
      "name": "Jati Notes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jatinotes.com/logo.png"
      }
    }
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
                  {posts.map((post: Post) => (
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

          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <SectionHeading
              viewAllLink={`/category/${techCategory?.slug || ''}`}
              className="mb-16"
            >
              <DecryptedText
                text="Saya membedah masa depan lewat baris kode dan logika untuk memahami dunia digital."
                animateOn="both"
                revealDirection="start"
                sequential={true}
                useOriginalCharsOnly={false}
                className="text-zinc-900 dark:text-zinc-50"
                encryptedClassName="text-amber-500 opacity-50"
              />
            </SectionHeading>

            <LazyMotionDiv
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {techCategory.posts.nodes.slice(0, 7).map((post: Post, index: number) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isWide={index % 7 === 1 || index % 7 === 3}
                  variant="glass"
                  accentColor="amber"
                />
              ))}
            </LazyMotionDiv>
          </div>
        </section>
      )}

      {/* Books Section with Stack Category */}
      {bookCategory && bookCategory.posts?.nodes && bookCategory.posts.nodes.length > 0 && (
        <section className="relative z-10 -mt-32 pt-64 pb-32 overflow-hidden bg-zinc-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-50" />

          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <SectionHeading
              className="mb-16"
              h2ClassName="font-medium text-white leading-[1.3] md:leading-[1.2]"
            >
              Sejak kecil, saya selalu suka{" "}
              <Link
                href={`/category/${bookCategory?.slug || ''}`}
                className="relative inline-flex items-center group/link align-baseline"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover/link:text-zinc-900">membaca buku</span>
                <span className="absolute bottom-1 left-0 w-full h-[30%] bg-amber-400/10 -z-0 transition-all duration-700 group-hover/link:h-full group-hover/link:bg-amber-300 rounded-sm" />
                <div className="relative ml-3 inline-flex h-[0.8em] w-[1.2em] items-center justify-center overflow-hidden rounded-md bg-zinc-800 transition-transform duration-300 group-hover/link:scale-110">
                  <Image
                    src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=100&auto=format&fit=crop"
                    alt="Books"
                    fill
                    loading="lazy"
                    className="h-full w-full object-cover opacity-80 group-hover/link:opacity-100"
                    sizes="48px"
                  />
                </div>
              </Link>
              . Bagi saya, buku adalah cara terbaik untuk mempelajari hal-hal baru tentang dunia.
            </SectionHeading>

            <LazyMotionDiv
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Category Stack on the left (Small) */}
              <BookCategoryStack categories={bookCategory.children?.nodes || []} />

              {/* Wide Card on the right (Besar Kanan) */}
              <PostCard
                post={bookCategory.posts.nodes[0]}
                isWide={true}
                variant="glass"
                accentColor="amber"
              />

              {/* Remaining Cards following pattern: Row 2 (S, W), Row 3 (S, S, S) */}
              {bookCategory.posts.nodes.slice(1, 6).map((post: Post, index: number) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isWide={index === 1} // Index 1 is the Wide card in Row 2
                  variant="glass"
                  accentColor="amber"
                />
              ))}
            </LazyMotionDiv>

            <div className="mt-20 flex justify-center">
              <Link href={`/category/${bookCategory?.slug || ''}`} className="group relative px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300 border border-white/10 flex items-center gap-4 overflow-hidden">
                <span className="relative z-10 font-bold tracking-wide">Jelajahi Perpustakaan Digital</span>
                <svg className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}