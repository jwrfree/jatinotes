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
import ListenToArticle from "@/components/features/ListenToArticle";

const CommentSection = dynamic(() => import("@/components/features/CommentSection"), {
  loading: () => <div className="h-96 animate-pulse bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />,
});

import { notFound } from "next/navigation";
import { MotionDiv, fadeIn, staggerContainer } from "@/components/ui/Animations";
import JsonLd from "@/components/features/JsonLd";
import { Metadata } from "next";
import PortableText from "@/components/features/PortableText";
import { extractTocFromPortableText } from "@/lib/sanity/toc";
import { PortableTextBlock } from "sanity";
import RelatedPosts from "@/components/features/RelatedPosts";

export const revalidate = 60;

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

  const isPortableText = Array.isArray(post.content);
  const portableTextContent = Array.isArray(post.content) ? post.content : null;
  let processedContent = post.content;
  let toc = [];

  if (isPortableText) {
    toc = extractTocFromPortableText(post.content as PortableTextBlock[]);
  } else {
    const result = processContent(post.content as string || "");
    processedContent = result.content;
    toc = result.toc;
  }

  const plainTextContent = stripHtml(post.content || "");

  const isBookReview = post.categories?.nodes?.some((c: { slug: string }) => c.slug === "buku");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: stripHtml(post.excerpt || "").substring(0, 160),
    image: post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : ["https://jatinotes.com/og-image.png"],
    datePublished: post.date,
    dateModified: post.modifiedDate || post.date,
    author: {
      "@type": "Person",
      name: post.author?.node?.name || "Wruhantojati",
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
    keywords: post.categories?.nodes.map((c: { name: string }) => c.name).join(", "),
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
    <article className="min-h-screen">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ReadingProgress />

      <BackgroundOrnaments variant="subtle" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-12 xl:gap-12">
          <div className="space-y-6 xl:col-span-8 xl:col-start-3">
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
                      <span className="inline-flex items-center rounded-full border border-zinc-200/80 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                        {post.categories?.nodes.find((c: { slug: string; name: string }) => c.slug !== "buku")?.name || post.categories?.nodes[0]?.name || "Blog"}
                      </span>
                    }
                    title={post.title}
                    titleClassName="text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl"
                    subtitle={
                      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-zinc-200/70 bg-zinc-50/80 px-4 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70 md:flex-row md:items-center md:justify-between md:px-5">
                        <PostMeta
                          authorName={post.author?.node?.name}
                          date={post.date}
                          post={post}
                        />
                        <ListenToArticle text={plainTextContent} title={post.title} />
                      </div>
                    }
                    subtitleClassName="mt-8"
                    description={post.excerpt || undefined}
                    descriptionClassName="mt-6 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-[1.05rem]"
                  />

                  {post.featuredImage?.node?.sourceUrl && (
                    <MotionDiv
                      variants={fadeIn}
                      className="group relative mx-auto mt-10 aspect-video w-full overflow-hidden rounded-[2rem] bg-zinc-100 shadow-2xl shadow-black/10 dark:bg-zinc-800"
                    >
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.title || ""}
                        fill
                        priority
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                      />
                    </MotionDiv>
                  )}

                  {isPortableText ? (
                    <div className="mt-10 max-w-none prose prose-zinc prose-base dark:prose-invert md:prose-lg prose-headings:scroll-mt-28 prose-headings:mt-12 prose-headings:mb-4 prose-p:my-5 prose-p:leading-8 prose-p:text-zinc-800 dark:prose-p:text-zinc-200 prose-a:text-amber-600 prose-a:font-medium prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50 prose-ul:my-6 prose-ol:my-6 prose-li:my-1.5 prose-blockquote:border-amber-500/40 prose-blockquote:text-zinc-700 dark:prose-blockquote:text-zinc-300 prose-hr:my-10">
                      <PortableText value={portableTextContent} />
                    </div>
                  ) : (
                    <Prose content={processedContent as string} className="mt-10 prose-headings:mt-12 prose-headings:mb-4 prose-p:my-5 prose-p:leading-8 prose-ul:my-6 prose-ol:my-6 prose-li:my-1.5 prose-blockquote:border-amber-500/40 prose-blockquote:text-zinc-700 dark:prose-blockquote:text-zinc-300 prose-hr:my-10" />
                  )}
                </div>
              </MotionDiv>
            </ContentCard>

            <div className="pb-12 pt-2">
              <LocalErrorBoundary name="Bagian Komentar">
                <CommentSection
                  comments={post.comments?.nodes || []}
                  postId={post.id}
                  commentCount={post.commentCount || 0}
                  postAuthorName={post.author?.node?.name}
                />
              </LocalErrorBoundary>
            </div>

            <LocalErrorBoundary name="Rekomendasi Tulisan">
              <RelatedPosts posts={post.related || []} />
            </LocalErrorBoundary>

            <div className="flex justify-center pb-8 pt-6">
              <Link
                href={isBookReview ? "/buku" : "/"}
                className="group flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold text-amber-500 shadow-sm transition-all hover:gap-5 dark:bg-zinc-900"
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
                {isBookReview ? "Kembali ke Rak Buku" : "Kembali ke Daftar Tulisan"}
              </Link>
            </div>
          </div>

          {toc.length > 0 && (
            <div className="relative hidden xl:col-span-2 xl:block">
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
