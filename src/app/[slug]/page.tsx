import { getPageBySlug, getPostsByCategory } from "@/lib/api";
import { stripHtml } from "@/lib/utils";
import { constructMetadata } from "@/lib/metadata";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MotionDiv, fadeIn, staggerContainer } from "@/components/ui/Animations";
import PageHeader from "@/components/layout/PageHeader";
import ContentCard from "@/components/layout/ContentCard";
import BackgroundOrnaments from "@/components/ui/BackgroundOrnaments";
import JsonLd from "@/components/features/JsonLd";
import Prose from "@/components/ui/Prose";
import PortableText from "@/components/features/PortableText";
import { Post } from "@/lib/types";
import PostCard from "@/components/features/PostCard";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";

// Use ISR
export const revalidate = 60;

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
    const pageJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      description: stripHtml(page.excerpt || "").substring(0, 160),
      url: `https://jatinotes.com/${slug}`,
      image: page.featuredImage?.node?.sourceUrl,
      publisher: {
        "@type": "Organization",
        name: "Jati Notes",
        logo: {
          "@type": "ImageObject",
          url: "https://jatinotes.com/icon.svg",
        },
      },
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://jatinotes.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.title,
          item: `https://jatinotes.com/${slug}`,
        },
      ],
    };

    return (
      <div className="relative overflow-hidden">
        <JsonLd data={pageJsonLd} />
        <JsonLd data={breadcrumbJsonLd} />
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

          {Array.isArray(page.content) ? (
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <PortableText value={page.content} />
            </div>
          ) : (
            <Prose content={page.content as string} />
          )}
        </ContentCard>
      </div>
    );
  }

  if (category) {
    const posts = category.posts?.nodes || [];
    const pageInfo = category.posts?.pageInfo;

    const categoryJsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.name,
      description: category.description || `Kumpulan artikel kategori ${category.name}`,
      url: `https://jatinotes.com/${slug}`,
      publisher: {
        "@type": "Organization",
        name: "Jati Notes",
        logo: {
          "@type": "ImageObject",
          url: "https://jatinotes.com/icon.svg",
        },
      },
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://jatinotes.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Kategori",
          item: "https://jatinotes.com/blog", // Fallback to blog for category parent
        },
        {
          "@type": "ListItem",
          position: 3,
          name: category.name,
          item: `https://jatinotes.com/${slug}`,
        },
      ],
    };

    return (
      <div className="relative overflow-hidden min-h-screen">
        <JsonLd data={categoryJsonLd} />
        <JsonLd data={breadcrumbJsonLd} />
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
