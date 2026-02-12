import { getAllBookReviews } from "@/lib/api";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import BackgroundOrnaments from "@/components/ui/BackgroundOrnaments";
import { MotionDiv, staggerContainer } from "@/components/ui/Animations";
import BookList from "@/components/features/BookList";

export const metadata: Metadata = constructMetadata({
  title: "Daftar Buku - Jati Notes",
  description: "Daftar lengkap buku yang telah dibaca oleh Wruhantojati dalam format tabel yang ringkas dan terstruktur.",
  url: "/buku/semua",
});

// Revalidate every 60 seconds to ensure fresh data from Sanity
export const revalidate = 60;

export default async function AllReviewsPage() {
  const { nodes: reviews } = await getAllBookReviews({ first: 100 });

  return (
    <div className="relative overflow-hidden min-h-screen">
      <BackgroundOrnaments variant="warm" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-32 pb-24">
        <MotionDiv
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <PageHeader
            title="Daftar Buku"
            subtitle="Koleksi buku yang telah dibaca, tersedia dalam tampilan grid atau tabel."
            topContent={
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-amber-500" />
                <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                  The Library
                </span>
              </div>
            }
          />

          <div className="mt-16">
            <BookList posts={reviews} />
          </div>
        </MotionDiv>
      </main>
    </div>
  );
}
