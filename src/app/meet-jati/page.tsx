import { getPageBySlug } from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import Image from "next/image";
import { MotionDiv, fadeIn, staggerContainer } from "@/components/Animations";
import DecryptedText from "@/components/DecryptedText";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet Jati",
  description: "Kenali lebih jauh tentang Wruhantojati, kreator di balik Jati Notes.",
};

export default async function MeetJatiPage() {
  const page = await getPageBySlug("meet-jati");

  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">Meet Jati</h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
          Halaman ini sedang dalam pengembangan atau konten tidak ditemukan di CMS.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Ornaments */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-amber-500/5 blur-[100px] rounded-full" />
      </div>

      <article className="relative z-10 mx-auto max-w-6xl px-4 pt-28 sm:pt-40 pb-12 sm:pb-24">
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-[3rem] shadow-2xl shadow-black/5 dark:shadow-white/5 p-8 sm:p-16">
          <MotionDiv
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className={`grid gap-12 items-start ${page.featuredImage?.node?.sourceUrl ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'}`}
          >
            {/* Header & Title - Left Column */}
            <div className={page.featuredImage?.node?.sourceUrl ? 'lg:col-span-7' : ''}>
              <header className="flex flex-col mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-8 bg-amber-500" />
                  <span className="text-sm font-bold text-amber-500">
                    The Person Behind
                  </span>
                </div>
                
                <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-7xl leading-[1.1] mb-8">
                  <DecryptedText 
                    text={page.title}
                    animateOn="view"
                    revealDirection="start"
                    sequential={true}
                    useOriginalCharsOnly={false}
                    className="text-zinc-900 dark:text-zinc-100"
                    encryptedClassName="text-amber-500 opacity-50"
                  />
                </h1>

                <div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-12" />
              </header>

              <div
                className="prose prose-zinc dark:prose-invert max-w-none prose-lg prose-headings:scroll-mt-28 prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-a:text-amber-500 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50"
                dangerouslySetInnerHTML={{ __html: sanitize(page.content) }}
              />
            </div>

            {/* Image - Right Column */}
            {page.featuredImage?.node?.sourceUrl && (
              <div className="lg:col-span-5 lg:sticky lg:top-32">
                <MotionDiv 
                  variants={fadeIn}
                  className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-800 shadow-2xl group"
                >
                  <Image
                    src={page.featuredImage.node.sourceUrl}
                    alt={page.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </MotionDiv>
              </div>
            )}
          </MotionDiv>
        </div>
      </article>
    </div>
  );
}
