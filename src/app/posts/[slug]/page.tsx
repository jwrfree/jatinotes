import { getPostBySlug } from "@/lib/api";
import { stripHtml } from "@/lib/utils";
import { sanitize, addIdsToHeadings } from "@/lib/sanitize";
import CommentSection from "@/components/CommentSection";
import ReadingProgress from "@/components/ReadingProgress";
import PostMeta from "@/components/PostMeta";
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
    return {
      title: "Post Not Found",
    };
  }

  const description = stripHtml(post.excerpt || post.content || "").substring(0, 160);
  const ogImage = post.featuredImage?.node?.sourceUrl || "/og-image.png";

  return {
    title: post.title,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      type: "article",
      url: `https://jatinotes.com/posts/${slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.date,
      authors: [post.author?.node?.name || "Wruhantojati"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [ogImage],
    },
  };
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
      
      {/* Background Ornaments */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-amber-500/5 blur-[100px] rounded-full" />
      </div>

      <article className="relative z-10 mx-auto max-w-5xl px-4 pt-28 sm:pt-40 pb-12 sm:pb-24">
        <div className="flex flex-col items-center">
          {/* Main Content */}
          <div className="w-full">
            <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-[3rem] border border-zinc-100 dark:border-zinc-800/50 p-8 sm:p-16">
              <MotionDiv
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="max-w-3xl mx-auto"
              >
                <header className="flex flex-col">
                  <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl leading-tight">
                    {post.title.replace(/[“”]/g, '"')}
                  </h1>
                  <PostMeta 
                    authorName={post.author?.node?.name} 
                    date={post.date} 
                    content={post.content || ""} 
                    className="mt-8"
                  />

                  {post.excerpt && (
                    <div 
                      className="mt-8 text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt) }}
                    />
                  )}
                </header>

                {post.featuredImage?.node?.sourceUrl && (
                  <MotionDiv 
                    variants={fadeIn}
                    className={`group relative mt-12 ${isBookReview ? 'aspect-[3/4.5] max-w-[320px]' : 'aspect-video w-full'} mx-auto overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800`}
                  >
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.title || ''}
                      fill
                      priority
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </MotionDiv>
                )}

                <div
                  className="mt-12 prose prose-zinc dark:prose-invert max-w-none prose-base md:prose-lg prose-headings:scroll-mt-28 prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-a:text-amber-500 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50"
                  dangerouslySetInnerHTML={{ __html: sanitize(processedContent) }}
                />

                <hr className="my-16 border-zinc-100 dark:border-zinc-800" />

                <CommentSection
                  comments={post.comments?.nodes || []}
                  postId={post.databaseId || 0}
                  commentCount={post.commentCount || 0}
                />

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
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
