import { getPageBySlug, getPostsByCategory } from "@/lib/api";
import { stripHtml } from "@/lib/utils";
import { constructMetadata } from "@/lib/metadata";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MotionDiv, fadeIn, staggerContainer } from "@/components/Animations";
import PageHeader from "@/components/PageHeader";
import ContentCard from "@/components/ContentCard";
import BackgroundOrnaments from "@/components/BackgroundOrnaments";
import Prose from "@/components/Prose";
import { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  // Parallel fetch to determine type
  const [page, category] = await Promise.all([
    getPageBySlug(slug),
    getPostsByCategory(slug)
  ]);

  if (page) {
    return constructMetadata({
      title: page.title,
      description: stripHtml(page.excerpt || page.content || "").substring(0, 160),
      image: page.featuredImage?.node?.sourceUrl,
      url: `/${slug}`,
    });
  }

  if (category) {
    return constructMetadata({
      title: `${category.name} - Koleksi Artikel`,
      description: category.description || `Kumpulan artikel dalam kategori ${category.name}. Pelajari lebih lanjut tentang ${category.name} di Jati Notes.`,
      url: `/${slug}`,
    });
  }

  return constructMetadata({ 
    title: "Halaman Tidak Ditemukan",
    noIndex: true,
  });
}

export default async function DynamicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ after?: string; before?: string }>;
}) {
  const { slug } = await params;
  const { after, before } = await searchParams;

  const paginationParams = before 
    ? { last: 12, before } 
    : { first: 12, after: after || "" };

  // Parallel fetch for better performance
  const [page, category] = await Promise.all([
    getPageBySlug(slug),
    getPostsByCategory(slug, paginationParams)
  ]);

  if (page) {
    return (
      <div className="relative overflow-hidden">
        <BackgroundOrnaments variant="subtle" />

        <ContentCard maxWidth="max-w-4xl">
          <PageHeader
            title={page.title}
            useDecryptedText={true}
            titleClassName="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl"
            className="mb-16"
            accent={<div className="h-1 w-20 bg-amber-500 rounded-full" />}
          />

          {page.featuredImage?.node?.sourceUrl && (
            <div className="relative mb-16 aspect-[21/9] overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-800 shadow-2xl">
                            <Image
                src={page.featuredImage.node.sourceUrl}
                alt={page.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1000px"
              />
            </div>
          )}

          <Prose content={page.content} />
        </ContentCard>
      </div>
    );
  }

  if (category) {
    const posts = category.posts?.nodes || [];
    const pageInfo = category.posts?.pageInfo;

    return (
      <div className="relative overflow-hidden min-h-screen">
        <BackgroundOrnaments variant="subtle" />

        <ContentCard>
          <PageHeader
            title={category.name}
            useDecryptedText={true}
            titleClassName="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl"
            className="mb-16"
            topContent={
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-amber-500" />
                <span className="text-sm font-bold text-amber-500">
                  Kategori: {category.name}
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
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2"
            >
              {posts.map((post: Post) => (
                <MotionDiv key={post.id} variants={fadeIn}>
                  <PostCard post={post} variant="minimal" />
                </MotionDiv>
              ))}
            </MotionDiv>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-500 dark:text-zinc-400">Tidak ada artikel dalam kategori ini.</p>
            </div>
          )}

          {pageInfo && (
            <Pagination pageInfo={pageInfo} baseUrl={`/${slug}`} />
          )}
        </ContentCard>
      </div>
    );
  }

  // 3. Not Found
  notFound();
}
