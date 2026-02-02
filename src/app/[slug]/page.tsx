import { getPageBySlug, getPostsByCategory } from "@/lib/api";
import { stripHtml } from "@/lib/utils";
import { sanitize } from "@/lib/sanitize";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MotionDiv, MotionSection, fadeIn, staggerContainer } from "@/components/Animations";
import DecryptedText from "@/components/DecryptedText";
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
  
  // Try page first
  const page = await getPageBySlug(slug);
  if (page) {
    return {
      title: page.title,
      description: stripHtml(page.excerpt || page.content || "").substring(0, 160),
    };
  }

  // Try category
  const category = await getPostsByCategory(slug);
  if (category) {
    return {
      title: category.name,
      description: `Kumpulan artikel dalam kategori ${category.name}`,
    };
  }

  return { title: "Halaman Tidak Ditemukan" };
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
        {/* Background Ornaments */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full" />
        </div>

        <MotionSection 
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="relative z-10 mx-auto max-w-4xl px-4 pt-28 sm:pt-40 pb-12 sm:pb-24"
        >
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-[3rem] shadow-2xl shadow-black/5 dark:shadow-white/5 p-8 sm:p-16">
            <header className="flex flex-col mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl mb-4">
                <DecryptedText 
                  text={page.title}
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  useOriginalCharsOnly={false}
                  className="text-zinc-900 dark:text-zinc-50"
                  encryptedClassName="text-amber-500 opacity-50"
                />
              </h1>
              <div className="h-1 w-20 bg-amber-500 rounded-full" />
            </header>

            {page.featuredImage?.node?.sourceUrl && (
              <div className="relative mb-16 aspect-[21/9] overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-800 shadow-2xl">
                <Image
                  src={page.featuredImage.node.sourceUrl}
                  alt={page.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-28 prose-headings:font-bold prose-a:text-amber-500 prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-900/50 prose-pre:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: sanitize(page.content) }}
            />
          </div>
        </MotionSection>
      </div>
    );
  }

  if (category) {
    const posts = category.posts?.nodes || [];
    return (
      <div className="relative overflow-hidden min-h-screen">
        {/* Background Ornaments */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full" />
        </div>

        <MotionSection 
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="relative z-10 mx-auto max-w-5xl px-6 pt-28 sm:pt-40 pb-12 sm:pb-24"
        >
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-[3rem] shadow-2xl shadow-black/5 dark:shadow-white/5 p-8 sm:p-16">
            <header className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-amber-500" />
                <span className="text-sm font-bold text-amber-500">
                  Kategori: {category.name}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl mb-6">
                <DecryptedText 
                  text={category.name}
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  useOriginalCharsOnly={false}
                  className="text-zinc-900 dark:text-zinc-50"
                  encryptedClassName="text-amber-500 opacity-50"
                />
              </h1>
              
              {category.description && (
                <p className="max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {category.description}
                </p>
              )}
            </header>

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

            {category.posts?.pageInfo && (
              <Pagination pageInfo={category.posts.pageInfo} baseUrl={`/${slug}`} />
            )}
          </div>
        </MotionSection>
      </div>
    );
  }

  // 3. Not Found
  notFound();
}
