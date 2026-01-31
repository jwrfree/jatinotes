import { getPageBySlug, getPostsByCategory } from "@/lib/api";
import { calculateReadingTime, stripHtml } from "@/lib/utils";
import { sanitize } from "@/lib/sanitize";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MotionDiv, MotionSection, fadeIn, staggerContainer } from "@/components/Animations";
import DecryptedText from "@/components/DecryptedText";
import PostCard from "@/components/PostCard";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    const category = await getPostsByCategory(slug);
    if (category) {
      return {
        title: category.name,
        description: `Kumpulan artikel dalam kategori ${category.name}`,
      };
    }
    return { title: "Page Not Found" };
  }

  return {
    title: page.title,
    description: stripHtml(page.excerpt || page.content || "").substring(0, 160),
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Try to fetch as a Page
  const page = await getPageBySlug(slug);

  if (page) {
    return (
      <div className="relative overflow-hidden">
        {/* Background Ornaments */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
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
                  encryptedClassName="text-primary opacity-50"
                />
              </h1>
              <div className="h-1 w-20 bg-primary rounded-full" />
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
              className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-28 prose-headings:font-bold prose-a:text-primary prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-900/50 prose-pre:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: sanitize(page.content) }}
            />
          </div>
        </MotionSection>
      </div>
    );
  }

  // 2. Try to fetch as a Category
  const category = await getPostsByCategory(slug);

  if (category) {
    const isSpecialCategory = ["teknologi", "buku"].includes(slug);
    const accentColor = slug === "buku" ? "amber" : "primary";

    return (
      <div className="relative overflow-hidden min-h-screen">
        {/* Background Ornaments */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 sm:pt-40 pb-12 sm:pb-24">
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-[3rem] shadow-2xl shadow-black/5 dark:shadow-white/5 p-8 sm:p-16">
            <MotionDiv 
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="mb-20"
            >
            <div className="flex items-center gap-4 mb-6">
              <div className={`h-px w-12 ${slug === "buku" ? "bg-amber-500" : "bg-primary"}`} />
              <span className={`text-sm font-bold ${slug === "buku" ? "text-amber-600 dark:text-amber-400" : "text-primary"}`}>
                Koleksi Catatan
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
                encryptedClassName={slug === "buku" ? "text-amber-500 opacity-50" : "text-primary opacity-50"}
              />
            </h1>
            
            {category.description && (
              <p className="max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {category.description}
              </p>
            )}
          </MotionDiv>

          {category.posts?.nodes?.length > 0 ? (
            <MotionDiv 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {category.posts.nodes.map((post: any, index: number) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  isWide={index % 4 === 0}
                  variant={isSpecialCategory ? "glass" : "default"}
                  accentColor={accentColor}
                />
              ))}
            </MotionDiv>
          ) : (
            <div className="p-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] text-center backdrop-blur-sm bg-white/5">
              <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">Belum Ada Catatan</h3>
              <p className="mt-2 text-zinc-500">Sedang menyusun pemikiran. Tulisan baru akan segera hadir.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    );
  }

  // 3. Not Found
  notFound();
}
