import SkeletonCard from "@/components/SkeletonCard";
import BackgroundOrnaments from "@/components/BackgroundOrnaments";
import ContentCard from "@/components/ContentCard";

export default function Loading() {
  return (
    <div className="relative min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <BackgroundOrnaments variant="subtle" />

      {/* Container utama untuk mensimulasikan page */}
      <ContentCard>
        {/* Header Skeleton */}
        <div className="mb-12 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>

          <div className="h-10 md:h-16 w-3/4 max-w-2xl bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          <div className="h-4 w-full max-w-lg bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>

        {/* Categories/Filter Skeleton */}
        <div className="mb-12 flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse flex-shrink-0" />
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </ContentCard>
    </div>
  );
}
