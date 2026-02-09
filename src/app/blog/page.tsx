import { getPostsByCategory } from "@/lib/api";
import { constructMetadata } from "@/lib/metadata";
import { MotionDiv, staggerContainer } from "@/components/Animations";
import PageHeader from "@/components/PageHeader";
import ContentCard from "@/components/ContentCard";
import BackgroundOrnaments from "@/components/BackgroundOrnaments";
import PostListItem from "@/components/PostListItem";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Post } from "@/lib/types";
import EmptyState from "@/components/EmptyState";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Blog",
  description: "Kumpulan artikel dan tutorial terbaru seputar teknologi dan desain.",
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
    <div className="relative overflow-hidden min-h-screen">
      <BackgroundOrnaments variant="subtle" />

      <ContentCard>
        <PageHeader
          title="Blog"
          useDecryptedText={true}
          titleClassName="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl"
          className="mb-16"
          topContent={
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-amber-500" />
              <span className="text-sm font-bold text-amber-500">
                Koleksi Catatan
              </span>
            </div>
          }
          subtitle={
            category.description && (
              <p className="max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {category.description}
              </p>
            )
          }
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
