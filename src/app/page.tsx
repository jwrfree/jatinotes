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

export const revalidate = 60;

export const metadata: Metadata = constructMetadata({
  title: "Jati Notes | Menata Isi Kepala Lewat Tulisan & Buku",
  description: "Catatan digital Wruhantojati tentang pengembangan web, desain UI/UX, dan perjalanan merapikan isi kepala.",
  url: "/",
});

export default async function Home() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Jati Notes — Beranda",
    "url": "https://jatinotes.com",
    "description": "Catatan digital Wruhantojati tentang pengembangan web, desain UI/UX, dan teknologi terbaru.",
    "isPartOf": { "@id": "https://jatinotes.com/#website" },
    "about": { "@id": "https://jatinotes.com/#person" },
  };

  const { posts, blogCategory, techCategory, bookCategory } = await getHomeData();

  return (
    <div className="relative min-h-screen">
      <JsonLd data={collectionJsonLd} />

      <BackgroundOrnaments />

      <HeroSection />

      <section className="relative z-10 mx-auto -mt-4 max-w-7xl px-6 pb-20 sm:-mt-6 sm:pb-24">
        {posts && posts.length > 0 ? (
          <div className="space-y-14 sm:space-y-16">
            <FeaturedPost post={posts[0]} />

            {blogCategory && posts.length > 0 && (
              <div className="space-y-8 sm:space-y-10">
                <SectionHeading
                  viewAllLink="/blog"
                  h2ClassName="font-semibold text-zinc-900 dark:text-zinc-50 leading-[1.08]"
                >
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
          <div className="rounded-[3rem] border-2 border-dashed border-zinc-200 p-20 text-center dark:border-zinc-800">
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">Belum Ada Catatan</h3>
            <p className="mt-2 text-zinc-500">Sedang menyusun pemikiran. Tulisan baru akan segera hadir.</p>
          </div>
        )}
      </section>

      <TechSection category={techCategory} />

      <BookSection category={bookCategory} />
    </div>
  );
}
