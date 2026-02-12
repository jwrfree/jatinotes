"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, List, Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Post } from "@/lib/types";
import { getBookTitle, getBookAuthor } from "@/lib/book-utils";

interface BookListProps {
    posts: Post[];
}

export default function BookList({ posts }: BookListProps) {
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

    return (
        <div>
            {/* View Toggle */}
            <div className="flex justify-end mb-8">
                <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-all duration-300 ${viewMode === "grid"
                                ? "bg-white dark:bg-zinc-700 text-amber-600 shadow-sm"
                                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            }`}
                        aria-label="Grid View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        className={`p-2 rounded-md transition-all duration-300 ${viewMode === "table"
                                ? "bg-white dark:bg-zinc-700 text-amber-600 shadow-sm"
                                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            }`}
                        aria-label="Table View"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                    /* GRID VIEW */
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
                    >
                        {posts.map((post) => (
                            <div key={post.id} className="group">
                                <Link href={`/posts/${post.slug}`} className="block h-full flex flex-col">
                                    {/* Book Cover Aspect Ratio 2:3 */}
                                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-800 mb-4 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                                        {post.featuredImage?.node?.sourceUrl ? (
                                            <Image
                                                src={post.featuredImage.node.sourceUrl}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                                                <Book size={32} className="text-zinc-300" />
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-1 group-hover:text-amber-600 transition-colors line-clamp-2">
                                            {getBookTitle(post)}
                                        </h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-3">
                                            {getBookAuthor(post)}
                                        </p>

                                        {/* Tags/Categories */}
                                        <div className="mt-auto flex flex-wrap gap-2">
                                            {post.categories?.nodes.filter(c => c.slug !== 'buku').slice(0, 1).map(cat => (
                                                <span key={cat.slug} className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    /* TABLE VIEW */
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-x-auto"
                    >
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-semibold tracking-tight text-zinc-400 dark:text-zinc-600 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="pb-4 pl-4 w-32">Tanggal</th>
                                    <th className="pb-4">Judul Buku</th>
                                    <th className="pb-4 hidden lg:table-cell">Penulis</th>
                                    <th className="pb-4 hidden md:table-cell">Genre</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                {posts.map((post) => (
                                    <tr
                                        key={post.id}
                                        className="group hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors duration-300"
                                    >
                                        <td className="py-6 pl-4 align-top">
                                            <div className="text-xs font-medium text-zinc-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                                {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="py-6 align-top">
                                            <Link href={`/posts/${post.slug}`} className="block">
                                                <div className="flex items-start gap-4">
                                                    {/* Mini Thumbnail in Table */}
                                                    <div className="relative w-12 h-16 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden hidden sm:block">
                                                        {post.featuredImage?.node?.sourceUrl ? (
                                                            <Image
                                                                src={post.featuredImage.node.sourceUrl}
                                                                alt={post.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Book size={16} className="text-zinc-300" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h3 className="text-sm md:text-base font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
                                                            {getBookTitle(post)}
                                                        </h3>
                                                        <div className="mt-1 flex flex-col gap-1 lg:hidden">
                                                            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                                                {getBookAuthor(post)}
                                                            </span>
                                                            <div className="flex items-center gap-2 md:hidden">
                                                                {post.categories?.nodes.filter(c => c.slug !== 'buku').slice(0, 1).map((cat) => (
                                                                    <span key={cat.slug} className="text-[10px] uppercase font-bold text-zinc-400">
                                                                        {cat.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="py-6 align-top hidden lg:table-cell">
                                            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                                {getBookAuthor(post)}
                                            </div>
                                        </td>
                                        <td className="py-6 align-top hidden md:table-cell pr-4 text-right md:text-left">
                                            <div className="flex flex-wrap gap-2 md:justify-start justify-end">
                                                {post.categories?.nodes.filter(c => c.slug !== 'buku').map((cat) => (
                                                    <span
                                                        key={cat.slug}
                                                        className="text-xs font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md"
                                                    >
                                                        {cat.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>

            {posts.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-zinc-500 dark:text-zinc-400">Belum ada review yang tersedia.</p>
                </div>
            )}
        </div>
    );
}
