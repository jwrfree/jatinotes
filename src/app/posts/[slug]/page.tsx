import { getPostBySlug } from "@/lib/api";
import { calculateReadingTime } from "@/lib/utils";
import { sanitize, addIdsToHeadings } from "@/lib/sanitize";
import CommentForm from "@/components/CommentForm";
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MotionDiv, fadeIn, staggerContainer } from "@/components/Animations";

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

  return (
    <div className="relative overflow-hidden min-h-screen">
      <ReadingProgress />
      
      {/* Background Ornaments */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-amber-500/5 blur-[100px] rounded-full" />
      </div>

      <article className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:py-24">
        <div className="flex flex-col items-center">
          {/* Main Content */}
          <div className="w-full">
            <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-[3rem] shadow-2xl shadow-black/5 dark:shadow-white/5 p-8 sm:p-16">
              <MotionDiv
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="max-w-3xl mx-auto"
              >
                <header className="flex flex-col">
                  <div className="flex items-center gap-4 text-sm text-zinc-400 dark:text-zinc-500 mb-6">
                    <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                      {calculateReadingTime(post.content || '')} menit baca
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl leading-tight">
                    {post.title}
                  </h1>
                  <div className="mt-6 flex items-center gap-3 text-sm text-zinc-500">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {post.author?.node?.name?.charAt(0) || "A"}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
                        {post.author?.node?.name || "Admin"}
                      </span>
                    </div>
                  </div>
                </header>

                {post.featuredImage?.node?.sourceUrl && (
                  <MotionDiv 
                    variants={fadeIn}
                    className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 shadow-xl"
                  >
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.title}
                      fill
                      priority
                      className="object-cover"
                    />
                  </MotionDiv>
                )}

                <div
                  className="mt-12 prose prose-zinc dark:prose-invert max-w-none prose-lg prose-headings:scroll-mt-28 prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-a:text-primary prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50"
                  dangerouslySetInnerHTML={{ __html: sanitize(processedContent) }}
                />

                <hr className="my-16 border-zinc-100 dark:border-zinc-800" />

                <section className="mt-16">
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
                    Diskusi ({post.commentCount || 0})
                  </h2>
                  
                  {post.comments?.nodes?.length > 0 ? (
                    <div className="space-y-8">
                      {post.comments.nodes.map((comment: any) => (
                        <div key={comment.id} className="group flex gap-5 p-6 rounded-3xl transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
                            {comment.author?.node?.avatar?.url ? (
                              <Image
                                src={comment.author.node.avatar.url}
                                alt={comment.author.node.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-400">
                                {comment.author?.node?.name?.charAt(0) || "U"}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                {comment.author?.node?.name}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                                {new Date(comment.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <div 
                              className="mt-2 text-zinc-600 dark:text-zinc-400 prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: sanitize(comment.content) }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-8 text-center border border-zinc-100 dark:border-zinc-800">
                      <p className="text-zinc-500 dark:text-zinc-400">Belum ada diskusi. Jadilah yang pertama memberikan tanggapan.</p>
                    </div>
                  )}
                  
                  <div className="mt-12 bg-zinc-50/30 dark:bg-zinc-800/20 backdrop-blur-sm rounded-[2.5rem] p-8 sm:p-12 border border-zinc-100/50 dark:border-zinc-800/50">
                    <CommentForm postId={post.databaseId} />
                  </div>
                </section>

                <div className="mt-20 flex justify-center border-t border-zinc-100 dark:border-zinc-800 pt-10">
                  <Link
                    href="/"
                    className="group flex items-center gap-3 text-sm font-bold text-primary transition-all hover:gap-5"
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
                    Kembali ke Daftar Tulisan
                  </Link>
                </div>
              </MotionDiv>
            </div>
          </div>

          {/* Sidebar with Table of Contents (Hidden for now) */}
          {/* 
          <aside className="hidden lg:block w-80 shrink-0 sticky top-32">
            <TableOfContents content={processedContent} />
          </aside>
          */}
        </div>
      </article>
    </div>
  );
}
