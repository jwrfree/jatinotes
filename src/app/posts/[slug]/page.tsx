import { getPostBySlug } from "@/lib/api";
import { PostRepository } from "@/lib/repositories/post.repository";
import { Post } from "@/lib/types";
import { stripHtml } from "@/lib/utils";
import { constructMetadata } from "@/lib/metadata";
import { processContent } from "@/lib/sanitize";
import { LocalErrorBoundary } from "@/components/ui/LocalErrorBoundary";
import TableOfContents from "@/components/features/TableOfContents";
import ReadingProgress from "@/components/features/ReadingProgress";
import PostMeta from "@/components/features/PostMeta";
import PageHeader from "@/components/layout/PageHeader";
import ContentCard from "@/components/layout/ContentCard";
import Prose from "@/components/ui/Prose";
import BackgroundOrnaments from "@/components/ui/BackgroundOrnaments";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const CommentSection = dynamic(() => import("@/components/features/CommentSection"), {
  loading: () => <div className="h-96 animate-pulse bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />,
});

import { notFound } from "next/navigation";
import { MotionDiv, fadeIn, staggerContainer } from "@/components/ui/Animations";
import JsonLd from "@/components/features/JsonLd";
import { Metadata } from "next";
import PortableText from "@/components/features/PortableText";
import { extractTocFromPortableText } from "@/lib/sanity/toc";

// Use ISR: regenerate page every 60 seconds if requested
export const revalidate = 60;

// Generate static pages for all posts at build time
export async function generateStaticParams() {
  try {
    const { nodes: posts } = await PostRepository.getAll({ first: 100 });

    return posts.map((post: Post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let post;

  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    console.error(`Metadata fetch error for ${slug}:`, error);
    return constructMetadata({
      title: "Catatan Jati",
      description: "Membaca catatan digital...",
    });
  }

  if (!post) {
    return constructMetadata({
      title: "Post Not Found",
      noIndex: true,
    });
  }

  // Use SEO fields if available (like Yoast SEO)
  const seoTitle = post.seo?.metaTitle || post.title;
  const seoDescription = post.seo?.metaDescription || post.excerpt || "Baca selengkapnya di Jati Notes";
  const seoImage = post.seo?.ogImage || post.featuredImage?.node?.sourceUrl;
  const seoNoIndex = post.seo?.noIndex || false;
  const seoCanonical = post.seo?.canonicalUrl;
  const seoKeywords = post.seo?.focusKeyword ? [post.seo.focusKeyword] : undefined;

  return constructMetadata({
    title: seoTitle,
    description: seoDescription,
    image: seoImage,
    type: "article",
    publishedTime: post.date,
    authors: [post.author?.node?.name || "Wruhantojati"],
    url: `/posts/${slug}`,
    noIndex: seoNoIndex,
    canonical: seoCanonical,
    keywords: seoKeywords,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post;

  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  // Determine content type
  const isPortableText = Array.isArray(post.content);
  let processedContent = post.content;
  let toc = [];

  if (isPortableText) {
    toc = extractTocFromPortableText(post.content as any[]);
  } else {
    const result = processContent(post.content as string || "");
    processedContent = result.content;
    toc = result.toc;
  }

  const isBookReview = post.categories?.nodes?.some(c => c.slug === 'buku');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: stripHtml(post.excerpt || "").substring(0, 160),
    image: post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : ["https://jatinotes.com/og-image.png"],
    datePublished: post.date,
    dateModified: post.date, // Should be modified date if available
    author: {
      "@type": "Person",
      name: post.author?.node?.name || "Wruhanto Jati",
      url: "https://jatinotes.com/meet-jati",
    },
    publisher: {
      "@type": "Organization",
      name: "Jati Notes",
      logo: {
        "@type": "ImageObject",
        url: "https://jatinotes.com/icon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://jatinotes.com/posts/${slug}`,
    },
    wordCount: post.wordCount,
    articleBody: stripHtml(typeof post.content === 'string' ? post.content : "").substring(0, 5000), // Approximate for schema
    keywords: post.categories?.nodes.map((c: any) => c.name).join(", "),
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
        name: "Blog",
        item: "https://jatinotes.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://jatinotes.com/posts/${slug}`,
      },
    ],
  };

  return (
    <article className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ReadingProgress />

      <BackgroundOrnaments variant="subtle" />

      {/* 
        Original Desktop Layout:
        - Outer Grid Wrapper (max-w-7xl, grid-cols-12)
        - Content centered in col-span-8
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">

          {/* Main Content Column (Restore Desktop layout) */}
          <div className="xl:col-span-8 xl:col-start-3 space-y-4">
            {/* 1. Main Article Content */}
            <ContentCard noBottomPadding noPadding>
              <MotionDiv
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="mx-auto"
              >
                <div id="main-article">
                  <PageHeader
                    topContent={
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {post.categories?.nodes.find(c => c.slug !== 'buku')?.name || post.categories?.nodes[0]?.name || 'Blog'}
                      </span>
                    }
                    title={post.title}
                    subtitle={
                      <PostMeta
                        authorName={post.author?.node?.name}
                        date={post.date}
                        post={post}
                      />
                    }
                    description={post.excerpt}
                  />

                  {post.featuredImage?.node?.sourceUrl && (
                    <MotionDiv
                      variants={fadeIn}
                      className="group relative mt-12 aspect-video w-full mx-auto overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-xl"
                    >
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.title || ''}
                        fill
                        priority
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                      />
                    </MotionDiv>
                  )}

                  {isPortableText ? (
                    <div className="mt-12 prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-28 prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-a:text-amber-500 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50 prose-base md:prose-lg">
                      <PortableText value={processedContent} />
                    </div>
                  ) : (
                    <Prose content={processedContent as string} className="mt-12" />
                  )}
                </div>
              </MotionDiv>
            </ContentCard>

            {/* 2. Comment Section - No Card Wrapper */}
            <div className="pb-24">
              <LocalErrorBoundary name="Bagian Komentar">
                <CommentSection
                  comments={post.comments?.nodes || []}
                  postId={post.id}
                  commentCount={post.commentCount || 0}
                  postAuthorName={post.author?.node?.name}
                />
              </LocalErrorBoundary>
            </div>

            {/* 3. Navigation Footer */}
            <div className="flex justify-center pt-4">
              <Link
                href={isBookReview ? "/buku" : "/"}
                className="group flex items-center gap-3 text-sm font-bold text-amber-500 transition-all hover:gap-5 px-6 py-3 rounded-full bg-white dark:bg-zinc-900"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4 stroke-current transition group-hover:-translate-x-1"
                >
                  <path
                    d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isBookReview ? 'Kembali ke Rak Buku' : 'Kembali ke Daftar Tulisan'}
              </Link>
            </div>
          </div>

          {/* Sidebar TOC - Visible on XL, outside ContentCard (Original Layout) */}
          {toc.length > 0 && (
            <div className="hidden xl:block xl:col-span-2 relative">
              <div className="sticky top-32">
                <TableOfContents toc={toc} />
              </div>
            </div>
          )}

        </div>
      </div>
    </article>
  );
}
