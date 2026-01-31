import { getAllPosts, getAllCategories, getPostsByCategory } from "@/lib/api";
import { calculateReadingTime } from "@/lib/utils";
import { sanitize } from "@/lib/sanitize";
import Link from "next/link";
import Image from "next/image";
import { MotionDiv, MotionSection, fadeIn, staggerContainer } from "@/components/Animations";
import DecryptedText from "@/components/DecryptedText";
import { Metadata } from "next";
import { Post, Category } from "@/lib/types";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Eksplorasi Teknologi & Desain",
  description: "Catatan digital Wruhantojati tentang pengembangan web, desain UI/UX, dan teknologi terbaru menggunakan Headless WordPress.",
  openGraph: {
    title: "Jati Notes | Eksplorasi Teknologi & Desain",
    description: "Catatan digital Wruhantojati tentang pengembangan web, desain UI/UX, dan teknologi terbaru.",
    type: "website",
  },
};

export default async function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Jati Notes",
    "url": "https://jatinotes.com",
    "description": "Catatan digital Wruhantojati tentang pengembangan web, desain UI/UX, dan teknologi terbaru.",
    "publisher": {
      "@type": "Organization",
      "name": "Jati Notes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jatinotes.com/logo.png"
      }
    }
  };

  let posts: Post[] = [];
  let bookCategory: Category | null = null;
  let techCategory: Category | null = null;
  let blogCategory: Category | null = null;

  try {
    const [postsData, , booksData, techData, blogData] = await Promise.all([
      getAllPosts(),
      getAllCategories(),
      getPostsByCategory("buku"),
      getPostsByCategory("teknologi"),
      getPostsByCategory("blog")
    ]);
    
    const rawPosts = postsData || [];
    bookCategory = booksData;
    techCategory = techData;
    blogCategory = blogData;

    // Filter posts to avoid redundancy
    const featuredPost = rawPosts[0];
    const techPosts = techCategory?.posts?.nodes || [];
    const bookPosts = bookCategory?.posts?.nodes || [];
    const blogPosts = blogCategory?.posts?.nodes || [];
    
    const techPostIdsShown = new Set(techPosts.map((p: Post) => p.id));
    const bookPostIdsShown = new Set(bookPosts.map((p: Post) => p.id));
    
    // Blog section posts: Filter from blogCategory specifically
    posts = blogPosts.filter((p: Post) => 
      p.id !== featuredPost?.id && 
      !techPostIdsShown.has(p.id) && 
      !bookPostIdsShown.has(p.id)
    ).slice(0, 6); // Taking 6 blog posts for the list

    // Keep the first post as featured
    if (featuredPost) {
      posts = [featuredPost, ...posts];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Background Ornaments */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full" />
      </div>

      {/* Hero Section */}
      <MotionSection 
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="relative z-10 pt-32 sm:pt-40 pb-24 sm:pb-32"
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl mb-6">
              Mengapa Saya <span className="text-primary italic">Menulis?</span>
            </h1>
            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Saya percaya bahwa menulis adalah cara terbaik untuk menjernihkan pikiran. Di sini, saya mendokumentasikan perjalanan saya memahami teknologi, desain, dan kompleksitas dunia web modern.
            </p>
          </div>
        </div>
      </MotionSection>

      {/* Main Content Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        {posts && posts.length > 0 ? (
          <div className="space-y-32">
            {/* Featured Post */}
            <div className="space-y-12">
              <MotionDiv
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
                className="group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-2xl transition-all duration-500 hover:shadow-primary/5"
              >
                <Link href={`/posts/${posts[0].slug}`} className="relative block aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
                  {posts[0].featuredImage?.node?.sourceUrl && (
                    <Image
                      src={posts[0].featuredImage.node.sourceUrl}
                      alt={posts[0].title}
                      fill
                      priority
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                    <div className="max-w-2xl backdrop-blur-xl bg-white/10 dark:bg-black/30 p-8 rounded-[2rem] shadow-2xl border border-white/10 transform transition-transform duration-500 group-hover:-translate-y-2">
                      <div className="flex items-center gap-3 text-white/60 text-xs font-medium mb-4">
                        <span>{calculateReadingTime(posts[0].content || '')} min baca</span>
                      </div>
                      <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-white group-hover:text-primary transition-colors duration-300">
                        {posts[0].title}
                      </h3>
                      <div
                        className="mt-6 text-sm md:text-base leading-relaxed text-zinc-300 line-clamp-2 opacity-80"
                        dangerouslySetInnerHTML={{ __html: sanitize(posts[0].excerpt) }}
                      />
                    </div>
                  </div>
                </Link>
              </MotionDiv>
            </div>

            {/* General Grid (Blog Category Only) */}
            {blogCategory && posts && posts.length > 0 && (
              <div className="space-y-12">
                <div className="max-w-3xl">
                  <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
                    Saya menulis untuk mengabadikan apa yang melintas di pikiran dan membagikannya kepada dunia.
                  </h2>
                </div>

                <MotionDiv 
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-4"
                >
                  {posts.map((post) => (
                    <MotionDiv
                      key={post.id}
                      variants={fadeIn}
                      className="group"
                    >
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-zinc-100 dark:border-zinc-800 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-400">
                            <span>{calculateReadingTime(post.content || "")} menit baca</span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <div 
                            className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt) }}
                          />
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-8 flex items-center gap-2 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <span className="text-xs font-bold">Baca Catatan</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </Link>
                    </MotionDiv>
                  ))}
                </MotionDiv>
              </div>
            )}
          </div>
        ) : (
          <div className="p-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] text-center">
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">Belum Ada Catatan</h3>
            <p className="mt-2 text-zinc-500">Sedang menyusun pemikiran. Tulisan baru akan segera hadir.</p>
          </div>
        )}
      </section>

      {/* Technology Section with Thematic Accent */}
      {techCategory && techCategory.posts?.nodes && techCategory.posts.nodes.length > 0 && (
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-primary/[0.02] dark:bg-primary/[0.01]" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          
          <div className="relative z-10 mx-auto max-w-5xl px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
                  <DecryptedText 
                     text="Saya membedah masa depan lewat baris kode dan logika untuk memahami dunia digital."
                     animateOn="both"
                     revealDirection="start"
                     sequential={true}
                     useOriginalCharsOnly={false}
                     className="text-zinc-900 dark:text-zinc-50"
                     encryptedClassName="text-primary opacity-50"
                   />
                </h2>
              </div>
              <Link href={`/category/${techCategory.slug}`} className="group flex items-center gap-3 text-sm font-bold text-primary">
                Lihat Semua
                <span className="w-8 h-px bg-primary transition-all duration-300 group-hover:w-12" />
              </Link>
            </div>

            <MotionDiv 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {techCategory.posts.nodes.slice(0, 7).map((post, index) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    isWide={index % 7 === 1 || index % 7 === 3}
                    variant="glass"
                    accentColor="primary"
                  />
              ))}
            </MotionDiv>
          </div>
        </section>
      )}

      {/* Books Section with Stack Category */}
      {bookCategory && bookCategory.posts?.nodes && bookCategory.posts.nodes.length > 0 && (
        <section className="relative py-32 overflow-hidden bg-zinc-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-50" />
          
          <div className="relative z-10 mx-auto max-w-5xl px-6">
            <div className="mb-16 max-w-4xl">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.3] md:leading-[1.2]">
                Sejak kecil, saya selalu suka{" "}
                <Link 
                  href={`/category/${bookCategory.slug}`}
                  className="relative inline-flex items-center group/link align-baseline"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover/link:text-zinc-900">membaca buku</span>
                  <span className="absolute bottom-1 left-0 w-full h-[30%] bg-amber-400/10 -z-0 transition-all duration-700 group-hover/link:h-full group-hover/link:bg-amber-300 rounded-sm" />
                  <div className="relative ml-3 inline-flex h-[0.8em] w-[1.2em] items-center justify-center overflow-hidden rounded-md bg-zinc-800 transition-transform duration-300 group-hover/link:scale-110">
                    <Image 
                      src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=100&auto=format&fit=crop" 
                      alt="Books"
                      fill
                      className="h-full w-full object-cover opacity-80 group-hover/link:opacity-100"
                    />
                  </div>
                </Link>
                . Bagi saya, buku adalah cara terbaik untuk mempelajari hal-hal baru tentang dunia.
              </h2>
            </div>

            <MotionDiv 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Category Stack on the left (Small) */}
              <div className="lg:col-span-1 flex flex-col justify-center py-4">
                {bookCategory.children?.nodes && bookCategory.children.nodes.length > 0 && (
                  <div className="relative flex flex-col">
                    {bookCategory.children.nodes.slice(0, 5).map((cat: Category, index: number) => {
                      const colors = [
                        "bg-[#E5E7EB] text-zinc-700", // Soft Grey
                        "bg-[#F3E8FF] text-purple-700", // Soft Purple
                        "bg-[#DBEAFE] text-blue-700", // Soft Blue
                        "bg-[#D1FAE5] text-emerald-700", // Soft Green
                        "bg-[#FEF3C7] text-amber-700", // Soft Amber
                      ];
                      const colorClass = colors[index % colors.length];
                      const rotation = (index % 3 - 1) * 2;
                      const xOffset = (index % 2 === 0 ? 4 : -4);
                      
                      return (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          className="group relative w-full h-32 -mb-12 transition-all duration-500 hover:z-50 hover:-translate-y-6 hover:scale-105"
                          style={{ 
                            transform: `rotate(${rotation}deg) translateX(${xOffset}px)`,
                          }}
                        >
                          <div className="absolute inset-0 bg-black/5 blur-xl rounded-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                          <div className={`absolute inset-0 rounded-lg shadow-sm group-hover:shadow-xl ${colorClass} flex items-center justify-between px-6 border-b-2 border-black/5 overflow-hidden transition-all duration-500`}>
                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-black/5" />
                            <span className="font-bold text-sm tracking-tight truncate pr-2">
                              {cat.name}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="opacity-60 text-[8px] font-black">
                                {cat.count}
                              </span>
                              <div className="w-1 h-6 bg-white/60 rounded-sm" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Wide Card on the right (Besar Kanan) */}
              <PostCard 
                post={bookCategory.posts.nodes[0]} 
                isWide={true}
                variant="glass"
                accentColor="amber"
              />

              {/* Remaining Cards following pattern: Row 2 (S, W), Row 3 (S, S, S) */}
              {bookCategory.posts.nodes.slice(1, 6).map((post, index) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    isWide={index === 1} // Index 1 is the Wide card in Row 2
                    variant="glass"
                    accentColor="amber"
                  />
              ))}
            </MotionDiv>
            
            <div className="mt-20 flex justify-center">
               <Link href={`/category/${bookCategory.slug}`} className="group relative px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300 border border-white/10 flex items-center gap-4 overflow-hidden">
                 <span className="relative z-10 font-bold tracking-wide">Jelajahi Perpustakaan Digital</span>
                 <svg className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                 <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}