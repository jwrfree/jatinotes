"use client";

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, ArrowRight, FileText, Calendar, User } from "lucide-react";
import { Post } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { formatDateIndonesian } from "@/lib/utils";
import { LocalErrorBoundary } from "./LocalErrorBoundary";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const selectedPost = searchResults[selectedIndex];
        if (selectedPost) {
          window.location.href = `/posts/${selectedPost.slug}`;
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, searchResults, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        setSelectedIndex(-1);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          if (!res.ok) throw new Error("Search failed");
          const data = await res.json();
          setSearchResults(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setSelectedIndex(-1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian artikel"
            className="fixed inset-x-4 top-[10%] z-[70] mx-auto max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            {/* Search Input Area */}
            <div className="relative flex items-center p-4 border-b border-zinc-100 dark:border-zinc-800">
              <Search className="ml-2 h-5 w-5 text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                aria-label="Cari artikel"
                placeholder="Cari artikel, teknologi, atau tutorial..."
                className="flex-1 bg-transparent px-4 py-2 text-lg outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={onClose}
                aria-label="Tutup pencarian"
                className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>

            {/* Results Area */}
            <div 
              ref={scrollContainerRef}
              className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar"
            >
              <LocalErrorBoundary name="Hasil Pencarian">
                {isSearching ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-4" />
                  <p>Mencari artikel terbaik untuk Anda...</p>
                </div>
              ) : searchQuery.trim().length > 0 && searchQuery.trim().length <= 2 ? (
                <div className="py-12 text-center text-zinc-500">
                  <p>Ketik minimal 3 karakter untuk mulai mencari.</p>
                </div>
              ) : searchResults.length > 0 ? (
                <ul className="grid gap-2 p-2">
                  {searchResults.map((post, index) => (
                    <li key={post.id} data-index={index}>
                      <Link
                        href={`/posts/${post.slug}`}
                        onClick={onClose}
                        className={`group flex gap-4 rounded-2xl p-3 transition-all duration-300 border ${
                          selectedIndex === index 
                            ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700" 
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-transparent hover:border-zinc-100 dark:hover:border-zinc-800"
                        }`}
                      >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        {post.featuredImage?.node?.sourceUrl ? (
                                                    <Image
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-400">
                            <FileText className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-center min-w-0">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-amber-500 transition-colors">
                          {post.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDateIndonesian(post.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author?.node?.name || "Jati"}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 italic">
                          {post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '').substring(0, 100) : "Klik untuk membaca selengkapnya..."}
                        </p>
                      </div>
                      <div className="flex items-center pr-2">
                        <ArrowRight className="h-5 w-5 text-zinc-300 dark:text-zinc-700 transform translate-x-0 group-hover:translate-x-1 group-hover:text-amber-500 transition-all" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : searchQuery.trim().length > 2 ? (
                <div className="py-16 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-800 mb-4">
                    <Search className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                    Tidak ditemukan hasil untuk <span className="text-zinc-900 dark:text-zinc-100">&quot;{searchQuery}&quot;</span>
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">Coba kata kunci lain atau periksa ejaan Anda.</p>
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-400">
                  <Search className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Mulai mencari artikel menarik...</p>
                </div>
              )}
              </LocalErrorBoundary>
            </div>

            {/* Footer */}
            <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex gap-6">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 tracking-wider">
                  <kbd className="rounded bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 text-zinc-600 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 shadow-sm">ESC</kbd>
                  <span>Tutup</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 tracking-wider">
                  <kbd className="rounded bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 text-zinc-600 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 shadow-sm">↑↓</kbd>
                  <span>Navigasi</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 tracking-wider">
                  <kbd className="rounded bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 text-zinc-600 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 shadow-sm">↵</kbd>
                  <span>Pilih</span>
                </div>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
