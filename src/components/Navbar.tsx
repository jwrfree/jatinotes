"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { m, AnimatePresence, Variants } from 'framer-motion';
import { Search } from 'lucide-react';
import SearchDialog from './SearchDialog';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

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
      <m.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-0 right-0 z-50 px-4 md:px-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <nav className={`mx-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled || isHovered
            ? "max-w-[95%] md:max-w-4xl bg-white/80 backdrop-blur-2xl dark:bg-zinc-900/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-zinc-200/50 dark:border-zinc-800/50 py-2 rounded-full" 
            : "max-w-5xl bg-transparent border-transparent py-4 rounded-[2rem]"
        }`}>

          <div className="flex items-center justify-between px-4 md:px-6">
            <div className="flex-[1.5] flex items-center">
              <Link href="/" className={`font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 z-50 transition-all duration-500 ${scrolled ? "text-lg" : "text-xl"}`}>
                Jati<span className="text-amber-500">Notes</span>
              </Link>
            </div>
            
            {/* Desktop Navigation - Centered */}
            <div className={`hidden md:flex items-center transition-all duration-500 rounded-full whitespace-nowrap bg-zinc-200/60 dark:bg-zinc-900/90 ${
              scrolled 
                ? "p-1" 
                : "p-1.5"
            }`}>
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    onMouseEnter={() => setHoveredPath(link.href)}
                    onMouseLeave={() => setHoveredPath(null)}
                    className={`relative px-5 py-2 font-medium transition-all duration-300 whitespace-nowrap ${
                      scrolled ? "text-xs" : "text-sm"
                    } ${
                      isActive 
                        ? "text-zinc-900 dark:text-zinc-50" 
                        : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    {isActive && (
                      <m.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-white dark:bg-zinc-700 shadow-sm rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {hoveredPath === link.href && !isActive && (
                      <m.div
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
                <Search className={`text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-all duration-500 ${scrolled ? "h-4 w-4" : "h-5 w-5"}`} />
              </button>

              {/* Mobile Toggle */}
              <button 
                onClick={toggleMenu}
                className="group relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none md:hidden"
                aria-label="Toggle Menu"
              >
                <span className={`bg-zinc-900 transition-all duration-300 dark:bg-zinc-50 ${scrolled ? "h-0.5 w-5" : "h-0.5 w-6"} ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`bg-zinc-900 transition-all duration-300 dark:bg-zinc-50 ${scrolled ? "h-0.5 w-5" : "h-0.5 w-6"} ${isOpen ? "opacity-0" : ""}`} />
                <span className={`bg-zinc-900 transition-all duration-300 dark:bg-zinc-50 ${scrolled ? "h-0.5 w-5" : "h-0.5 w-6"} ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </button>
            </div>
          </div>
        </nav>
      </m.div>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-start justify-center bg-zinc-950/20 backdrop-blur-sm pt-28 px-6 md:hidden"
            onClick={toggleMenu}
          >
            <m.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-zinc-100/95 p-8 shadow-2xl backdrop-blur-2xl dark:bg-zinc-900/95"
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
                          ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25" 
                          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      }`}
                      onClick={toggleMenu}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
      <SearchDialog 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}
