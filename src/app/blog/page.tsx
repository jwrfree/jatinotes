import { getPostsByCategory } from "@/lib/api";
import { constructMetadata } from "@/lib/metadata";
import { MotionDiv, staggerContainer } from "@/components/ui/Animations";
import PageHeader from "@/components/layout/PageHeader";
import ContentCard from "@/components/layout/ContentCard";
import BackgroundOrnaments from "@/components/ui/BackgroundOrnaments";
import PostListItem from "@/components/features/PostListItem";
import Pagination from "@/components/ui/Pagination";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Post } from "@/lib/types";
import EmptyState from "@/components/ui/EmptyState";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Jurnal Jati",
  description: "Kumpulan catatan, tutorial, dan pemikiran yang sedang dirapikan. Sebuah upaya mendokumentasikan proses belajar dan bertumbuh.",
  url: "/blog",
});

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ after?: string; before?: string }>;
}) {
  const { after, before } = await searchParams;

  const paginationParams = before
    ? { last: 10, before }
    : { first: 10, after: after || "" };

  const category = await getPostsByCategory("blog", paginationParams);

  if (!category) {
    notFound();
  }

  const posts = category.posts?.nodes || [];
  const pageInfo = category.posts?.pageInfo;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundOrnaments variant="subtle" />

      <ContentCard maxWidth="max-w-5xl">
        <PageHeader
          title="Blog"
          useDecryptedText={false}
          titleClassName="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl"
          className="mb-12"
          topContent={
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-500">
                Koleksi Catatan
              </span>
            </div>
          }
          subtitle={
            category.description && (
              <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-lg">
                {category.description}
              </p>
            )
          }
          description="Kumpulan tulisan yang disusun supaya mudah dijelajahi, dari catatan pendek sampai pemikiran yang lebih panjang."
        />

        {posts.length > 0 ? (
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
        ) : (
          <EmptyState
            icon={<BookOpen className="w-10 h-10 text-amber-500" />}
            title="Belum Ada Catatan"
            description="Penulis sedang menyusun pemikiran baru. Kunjungi lagi nanti untuk tulisan terbaru."
            actionLabel="Jelajahi Kategori Lain"
            actionHref="/categories"
            className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] backdrop-blur-sm bg-white/5"
          />
        )}

        {pageInfo && (
          <Pagination pageInfo={pageInfo} baseUrl="/blog" />
        )}
      </ContentCard>
    </div>
  );
}
