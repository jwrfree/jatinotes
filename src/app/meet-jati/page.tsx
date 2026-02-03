import { getPageBySlug } from "@/lib/api";
import { constructMetadata } from "@/lib/metadata";
import Image from "next/image";
import { MotionDiv, fadeIn, staggerContainer } from "@/components/Animations";
import PageHeader from "@/components/PageHeader";
import ContentCard from "@/components/ContentCard";
import Prose from "@/components/Prose";
import BackgroundOrnaments from "@/components/BackgroundOrnaments";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Meet Jati - Cerita & Perjalanan",
  description: "Kenali lebih jauh tentang Wruhantojati. Tempat berbagi tulisan pribadi, review buku, ulasan teknologi, dan catatan perjalanan.",
  url: "/meet-jati",
});

export default async function MeetJatiPage() {
  const page = await getPageBySlug("meet-jati");

  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">Meet Jati</h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
          Halaman ini sedang dalam pengembangan atau konten tidak ditemukan di CMS.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      <BackgroundOrnaments variant="warm" />

      <ContentCard maxWidth="max-w-6xl">
        <MotionDiv
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className={`grid gap-12 items-start ${page.featuredImage?.node?.sourceUrl ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'}`}
        >
          {/* Header & Title - Left Column */}
          <div className={page.featuredImage?.node?.sourceUrl ? 'lg:col-span-7' : ''}>
            <PageHeader
              title={page.title}
              useDecryptedText={true}
              titleClassName="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-7xl leading-[1.1]"
              className="mb-12"
              topContent={
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-amber-500" />
                  <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                    Penulis & Penjelajah
                  </span>
                </div>
              }
              accent={<div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-12" />}
            />

            <Prose content={page.content} />
          </div>

          {/* Image - Right Column */}
          {page.featuredImage?.node?.sourceUrl && (
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <MotionDiv 
                variants={fadeIn}
                className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-800 shadow-2xl group"
              >
                <Image
                  src={page.featuredImage.node.sourceUrl}
                  alt={page.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </MotionDiv>
            </div>
          )}
        </MotionDiv>
      </ContentCard>
    </div>
  );
}
