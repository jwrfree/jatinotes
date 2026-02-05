import { getPostBySlug } from "@/lib/api";
import { stripHtml } from "@/lib/utils";
import { constructMetadata } from "@/lib/metadata";
import { addIdsToHeadings } from "@/lib/sanitize";
import { LocalErrorBoundary } from "@/components/LocalErrorBoundary";
import CommentSection from "@/components/CommentSection";
import ReadingProgress from "@/components/ReadingProgress";
import PostMeta from "@/components/PostMeta";
import PageHeader from "@/components/PageHeader";
import ContentCard from "@/components/ContentCard";
import Prose from "@/components/Prose";
import BackgroundOrnaments from "@/components/BackgroundOrnaments";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MotionDiv, fadeIn, staggerContainer } from "@/components/Animations";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return constructMetadata({
      title: "Post Not Found",
      noIndex: true,
    });
  }

  const description = stripHtml(post.excerpt || post.content || "").substring(0, 160);
  const image = post.featuredImage?.node?.sourceUrl;

  return constructMetadata({
    title: post.title,
    description,
    image,
    type: "article",
    publishedTime: post.date,
    authors: [post.author?.node?.name || "Wruhantojati"],
    url: `/posts/${slug}`,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const processedContent = addIdsToHeadings(post.content || "");
  const isBookReview = post.categories?.nodes?.some(c => c.slug === 'buku');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": stripHtml(post.excerpt || post.content || "").substring(0, 160),
    "image": post.featuredImage?.node?.sourceUrl || "https://jatinotes.com/og-image.png",
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author?.node?.name || "Wruhantojati",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Jati Notes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jatinotes.com/logo.png"
      }
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      
      <BackgroundOrnaments variant="subtle" />

      <ContentCard>
        <MotionDiv
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-3xl mx-auto"
        >
          <PageHeader
            title={post.title}
            subtitle={
              <PostMeta 
                authorName={post.author?.node?.name} 
                date={post.date} 
                content={post.content || ""} 
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

          <Prose content={processedContent} className="mt-12" />

          <hr className="my-16 border-zinc-100 dark:border-zinc-800" />

          <LocalErrorBoundary name="Bagian Komentar">
            <CommentSection
              comments={post.comments?.nodes || []}
              postId={parseInt(post.databaseId?.toString() || "0")}
              commentCount={post.commentCount || 0}
            />
          </LocalErrorBoundary>

          <div className="mt-20 flex justify-center border-t border-zinc-100 dark:border-zinc-800 pt-10">
            <Link
              href={isBookReview ? "/buku" : "/"}
              className="group flex items-center gap-3 text-sm font-bold text-amber-500 transition-all hover:gap-5"
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
        </MotionDiv>
      </ContentCard>
    </div>
  );
}
