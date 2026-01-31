"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { Post } from '@/lib/types';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always visible, only track scrolled state
      setScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, isSearchOpen]);

  // Debounced Search Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSearchResults(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const links = [
    { href: "/", label: "Beranda" },
    { href: "/blog", label: "Blog" },
    { href: "/buku", label: "Buku" },
    { href: "/teknologi", label: "Teknologi" },
    { href: "/desain", label: "Desain" },
    { href: "/meet-jati", label: "Meet Jati" },
  ];

  return (
    <>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-0 right-0 z-50 px-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <nav className={`mx-auto max-w-5xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled || isHovered
            ? "bg-white/80 backdrop-blur-2xl dark:bg-zinc-900/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-zinc-200/50 dark:border-zinc-800/50 py-2 rounded-[2rem]" 
            : "bg-transparent border-transparent py-3 rounded-[2.5rem]"
        }`}>

          <div className="flex items-center justify-between px-8">
            <div className="flex-[1.5] flex items-center">
              <Link href="/" className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 z-50">
                Jati<span className="text-primary">Notes</span>
              </Link>
            </div>
            
            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center bg-zinc-100/50 dark:bg-zinc-800/80 p-1.5 rounded-full whitespace-nowrap border border-zinc-200/50 dark:border-zinc-700/50">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    onMouseEnter={() => setHoveredPath(link.href)}
                    onMouseLeave={() => setHoveredPath(null)}
                    className={`relative px-5 py-2 text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                      isActive 
                        ? "text-zinc-900 dark:text-zinc-50" 
                        : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-white dark:bg-zinc-700 shadow-sm rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {hoveredPath === link.href && !isActive && (
                      <motion.div
                        layoutId="hover-pill"
                        className="absolute inset-0 bg-zinc-200/50 dark:bg-zinc-700/40 rounded-full"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex-[1.5] flex justify-end items-center gap-2">
              {/* Search Icon */}
              <button 
                onClick={toggleSearch}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-300 focus:outline-none"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-colors" />
              </button>

              {/* Mobile Toggle */}
              <button 
                onClick={toggleMenu}
                className="group relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none md:hidden"
                aria-label="Toggle Menu"
              >
                <span className={`h-0.5 w-6 bg-zinc-900 transition-transform duration-300 dark:bg-zinc-50 ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`h-0.5 w-6 bg-zinc-900 transition-opacity duration-300 dark:bg-zinc-50 ${isOpen ? "opacity-0" : ""}`} />
                <span className={`h-0.5 w-6 bg-zinc-900 transition-transform duration-300 dark:bg-zinc-50 ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </button>
            </div>
          </div>
        </nav>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-start justify-center bg-zinc-950/20 backdrop-blur-sm pt-28 px-6 md:hidden"
            onClick={toggleMenu}
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-zinc-200/50 bg-white/90 p-8 shadow-2xl backdrop-blur-2xl dark:border-zinc-800/50 dark:bg-zinc-900/90"
            >
              <div className="flex flex-col space-y-4">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={`relative flex items-center justify-center rounded-2xl py-4 text-lg font-semibold transition-all ${
                        isActive 
                          ? "bg-primary text-white shadow-lg shadow-primary/25" 
                          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      }`}
                      onClick={toggleMenu}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-white/80 backdrop-blur-xl dark:bg-zinc-950/80 pt-24 px-6"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-6 w-6 text-zinc-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Cari artikel, buku, atau desain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200/50 bg-white/50 px-12 py-4 text-lg text-zinc-900 backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-50 transition-all duration-300"
                />
                <button 
                  onClick={toggleSearch}
                  className="absolute right-4 rounded-lg p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="Tutup pencarian"
                >
                  <X className="h-5 w-5 text-zinc-500" />
                </button>
              </div>

              <div className="mt-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-zinc-500">Mencari inspirasi...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4 pb-8"
                  >
                    {searchResults.map((post) => (
                      <motion.div key={post.id} variants={itemVariants}>
                        <Link
                          href={`/posts/${post.slug}`}
                          onClick={toggleSearch}
                          className="group flex flex-col rounded-2xl bg-white/80 p-5 shadow-sm border border-zinc-100 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 dark:bg-zinc-900/80 dark:border-zinc-800 dark:hover:border-primary/20"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-primary dark:text-zinc-50 transition-colors">
                              {post.title}
                            </h3>
                            <ArrowRight className="h-4 w-4 text-zinc-400 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                          </div>
                          {post.excerpt && (
                            <div 
                              className="mt-2 text-sm text-zinc-500 line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: post.excerpt }}
                            />
                          )}
                          <div className="mt-3 flex items-center text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                            {new Date(post.date).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : searchQuery.length > 2 ? (
                  <div className="py-12 text-center">
                    <p className="text-zinc-500">Tidak ada hasil ditemukan untuk &quot;{searchQuery}&quot;</p>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-zinc-400">Ketik minimal 3 karakter untuk mulai mencari</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
