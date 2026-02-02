import { getPostsByCategory } from "@/lib/api";
import { MotionDiv, MotionSection, fadeIn, staggerContainer } from "@/components/Animations";
import DecryptedText from "@/components/DecryptedText";
import PostListItem from "@/components/PostListItem";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Post } from "@/lib/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Kumpulan artikel dan tutorial terbaru seputar teknologi dan desain.",
};

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
                Koleksi Catatan
              </span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl mb-6">
              <DecryptedText 
                text="Blog"
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
              className="space-y-4"
            >
              {posts.map((post: Post) => (
                <PostListItem key={post.id} post={post} />
              ))}
            </MotionDiv>
          ) : (
            <div className="p-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] text-center backdrop-blur-sm bg-white/5">
              <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">Belum Ada Catatan</h3>
              <p className="mt-2 text-zinc-500">Sedang menyusun pemikiran. Tulisan baru akan segera hadir.</p>
            </div>
          )}

          {pageInfo && (
            <Pagination pageInfo={pageInfo} baseUrl="/blog" />
          )}
        </div>
      </MotionSection>
    </div>
  );
}
