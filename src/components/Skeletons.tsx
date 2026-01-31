import { MotionDiv } from "./Animations";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 ${className}`} />
  );
}

export function HomeSkeleton() {
  return (
    <div className="relative">
      {/* Hero Skeleton */}
      <div className="bg-zinc-900 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-2xl space-y-4">
            <Skeleton className="h-12 w-3/4 sm:h-16" />
            <Skeleton className="h-12 w-1/2 sm:h-16" />
            <div className="pt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section Skeleton */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="flex items-center justify-between mb-12">
          <Skeleton className="h-8 w-48" />
          <div className="h-px flex-grow mx-8 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="space-y-24">
          {/* Featured Post Skeleton */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-3xl">
            <Skeleton className="h-full w-full" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
              <div className="max-w-xl backdrop-blur-md bg-white/10 p-5 sm:p-6 rounded-xl">
                <div className="flex gap-3 mb-3">
                  <Skeleton className="h-3 w-16 bg-white/20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full bg-white/20" />
                  <Skeleton className="h-8 w-2/3 bg-white/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid gap-x-8 gap-y-16 border-t border-zinc-100 pt-16 dark:border-zinc-800 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
