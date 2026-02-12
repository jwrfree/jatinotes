export default function SkeletonCard() {
    return (
        <div className="flex flex-col h-full overflow-hidden rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            {/* Image Skeleton */}
            <div className="aspect-[16/10] w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

            {/* Content Skeleton */}
            <div className="flex flex-col flex-grow p-6 space-y-4">
                {/* Meta */}
                <div className="flex items-center gap-3">
                    <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                    <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-6 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
                    <div className="h-6 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
                </div>

                {/* Excerpt */}
                <div className="space-y-2 pt-2">
                    <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>

                {/* Footer */}
                <div className="pt-4 mt-auto flex items-center justify-between">
                    <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
}
