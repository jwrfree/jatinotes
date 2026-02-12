import { getPageBySlug, getPostsByCategory } from "@/lib/api";
import { stripHtml } from "@/lib/utils";
import { constructMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
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
      <div className="relative min-h-screen bg-[#fcfcfc] dark:bg-zinc-950 transition-colors duration-500">
        <JsonLd data={categoryJsonLd} />
        <JsonLd data={breadcrumbJsonLd} />
        
        {/* Background Ambience - Similar to /buku */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-100/30 dark:bg-blue-900/10 blur-[150px] rounded-full opacity-50" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-100/30 dark:bg-purple-900/10 blur-[150px] rounded-full opacity-50" />
        </div>

        {slug === 'teknologi' ? (
          <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32 pb-24 space-y-24 sm:space-y-32">
            {/* Header Typography - Similar to /buku */}
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-amber-500" />
                <span className="text-xs font-medium uppercase tracking-widest text-amber-600 dark:text-amber-500">
                  The Lab
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-bold text-zinc-900 dark:text-white tracking-tight">
                {category.name}
              </h1>
              {category.description && (
                <p className="max-w-3xl text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mt-6">
                  {category.description}
                </p>
              )}
            </header>

            {posts.length > 0 ? (
              <div className="space-y-24 sm:space-y-32">
                
                {/* === 1. HERO SECTION === */}
                <section>
                  {/* Hero Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Featured Tech Post (Left - 7 cols) */}
                    <div className="lg:col-span-7">
                      {posts[0] && (
                        <Link href={`/posts/${posts[0].slug}`} className="group block relative h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl">
                          {posts[0].featuredImage?.node?.sourceUrl && (
                            <Image
                              src={posts[0].featuredImage.node.sourceUrl}
                              alt={posts[0].title}
                              fill
                              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                              priority
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-8 sm:p-10 max-w-2xl">
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/50 backdrop-blur-md rounded-full border border-amber-500/20">
                              Featured Tech
                            </span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                              {posts[0].title}
                            </h2>
                            <div className="text-zinc-300 line-clamp-3 md:line-clamp-none mb-6 text-sm sm:text-base leading-relaxed hidden sm:block" dangerouslySetInnerHTML={{ __html: stripHtml(posts[0].excerpt || "") }} />
                            <div className="flex items-center gap-2 text-white font-bold text-sm group-hover:gap-4 transition-all">
                              Baca Selengkapnya
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>

                    {/* Latest Tech Grid (Right - 5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                          Baru Ditambahkan
                        </h3>
                        <div className="flex flex-col gap-4">
                          {posts.slice(1, 4).map((post: Post) => (
                            <Link key={post.id} href={`/posts/${post.slug}`} className="group flex gap-4 items-center bg-white dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-amber-500/50 transition-colors">
                              <div className="relative w-24 h-16 shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
                                {post.featuredImage?.node?.sourceUrl && (
                                  <Image
                                    src={post.featuredImage.node.sourceUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="100px"
                                  />
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                                  {post.title}
                                </h4>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                  {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stats / Intro */}
                      <div className="mt-8 p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mb-3"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-4">
                          Eksplorasi dunia teknologi, pemrograman, dan inovasi digital. Dari tutorial praktis hingga analisis mendalam.
                        </p>
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
                          <span>Total Artikel</span>
                          <span>{posts.length}+ Post</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* === 2. ARSIP TEKNOLOGI SECTION === */}
                {posts.length > 4 && (
                  <section>
                    <div className="mb-10">
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 block">Arsip Teknologi</span>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-zinc-900 dark:text-white leading-tight">
                        Semua artikel teknologi yang pernah ditulis.
                      </h2>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {posts.slice(4).map((post: Post) => (
                        <MotionDiv key={post.id} variants={fadeIn}>
                          <PostCard 
                            post={post} 
                            variant="tech" 
                            customAspectRatio="aspect-[3/2]"
                          />
                        </MotionDiv>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-zinc-500 dark:text-zinc-400">Tidak ada artikel dalam kategori ini.</p>
              </div>
            )}
            
            {pageInfo && (
              <Pagination pageInfo={pageInfo} baseUrl={`/${slug}`} />
            )}
          </main>
        ) : (
          <ContentCard>
            <PageHeader
              title={category.name}
              useDecryptedText={true}
              titleClassName="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl"
              className="mb-16"
              topContent={
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-amber-500" />
                  <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">
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
        )}
      </div>
    );
  }

  // 3. Not Found
  notFound();
}
