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
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0, 0, 0.2, 1],
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants: Variants = {
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0, 0, 0.2, 1]
      }
    }
  };

  const links = [
    { href: "/", label: "Beranda" },
    { href: "/blog", label: "Blog" },
    {
      href: "/buku",
      label: "Buku",
      submenu: [
        { href: "/buku", label: "Semua Buku" },
        { href: "/buku/semua", label: "Daftar Buku" },
      ]
    },
    { href: "/teknologi", label: "Teknologi" },
    { href: "/desain", label: "Desain" },
    { href: "/meet-jati", label: "Meet Jati" },
  ];

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

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
        <nav className={`mx-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled || isHovered
          ? "max-w-[95%] md:max-w-4xl bg-white/40 dark:bg-zinc-950/40 shadow-xl shadow-black/5 dark:shadow-white/5 border border-white/20 dark:border-white/10 py-2 rounded-full"
          : "max-w-5xl bg-transparent border-transparent py-4 rounded-[2rem]"
          }`}
          style={{
            backdropFilter: (scrolled || isHovered) ? "blur(20px)" : "none",
            WebkitBackdropFilter: (scrolled || isHovered) ? "blur(20px)" : "none",
          }}
        >

          <div className="flex items-center justify-between px-4 md:px-6">
            <div className="flex-[1.5] flex items-center">
              <Link href="/" className={`font-semibold sm:font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 z-50 transition-all duration-500 ${scrolled ? "text-lg" : "text-xl"}`}>
                Jati<span className="text-amber-500">Notes</span>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <div 
              onMouseLeave={() => {
                setHoveredPath(null);
                setOpenSubmenu(null);
              }}
              className={`hidden md:flex items-center transition-all duration-500 rounded-full whitespace-nowrap bg-zinc-200/60 dark:bg-zinc-900/90 ${scrolled
              ? "p-1"
              : "p-1.5"
              }`}
            >
              {links.map((link) => {
                const isActive = pathname === link.href || (link.submenu && link.submenu.some(sub => pathname === sub.href));
                const hasSubmenu = 'submenu' in link && link.submenu;
                const showPill = hoveredPath === link.href || (hoveredPath === null && isActive);

                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => {
                      setHoveredPath(link.href);
                      setOpenSubmenu(hasSubmenu ? link.href : null);
                    }}
                  >
                    <Link
                      href={link.href}
                      className={`relative px-5 py-2 font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1 ${scrolled ? "text-xs" : "text-sm"
                        } ${isActive
                          ? "text-zinc-900 dark:text-zinc-50"
                          : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                        }`}
                    >
                      {showPill && (
                        <m.div
                          layoutId="navbar-pill"
                          className={`absolute inset-0 rounded-full ${
                            isActive
                              ? "bg-white dark:bg-zinc-700 shadow-sm"
                              : "bg-white/60 dark:bg-zinc-700/40"
                          }`}
                          transition={{ type: "spring", stiffness: 250, damping: 25 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                      {hasSubmenu && (
                        <svg
                          className={`relative z-10 w-3 h-3 transition-transform duration-200 ${openSubmenu === link.href ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>

                    {/* Dropdown Submenu */}
                    <AnimatePresence>
                      {hasSubmenu && openSubmenu === link.href && (
                        <m.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 min-w-[180px] bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden"
                        >
                          {link.submenu.map((sublink) => {
                            const isSubActive = pathname === sublink.href;
                            return (
                              <Link
                                key={sublink.href}
                                href={sublink.href}
                                className={`block px-4 py-3 text-sm font-medium transition-colors ${isSubActive
                                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
                                  }`}
                              >
                                {sublink.label}
                              </Link>
                            );
                          })}
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
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
                  const isActive = pathname === link.href || (link.submenu && link.submenu.some(sub => pathname === sub.href));
                  const hasSubmenu = 'submenu' in link && link.submenu;
                  const isSubmenuOpen = openSubmenu === link.href;

                  return (
                    <m.div
                      key={link.href}
                      variants={menuItemVariants}
                    >
                      {hasSubmenu ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => setOpenSubmenu(isSubmenuOpen ? null : link.href)}
                            className={`w-full relative flex items-center justify-center gap-2 rounded-full px-6 py-3 text-lg font-semibold transition-all ${isActive
                              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700"
                              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                              }`}
                          >
                            <span>{link.label}</span>
                            <svg
                              className={`w-4 h-4 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          <AnimatePresence>
                            {isSubmenuOpen && (
                              <m.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2 overflow-hidden"
                              >
                                {link.submenu.map((sublink) => {
                                  const isSubActive = pathname === sublink.href;
                                  return (
                                    <Link
                                      key={sublink.href}
                                      href={sublink.href}
                                      className={`block text-center rounded-full px-6 py-2.5 text-base font-medium transition-all ${isSubActive
                                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                                        : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                        }`}
                                      onClick={toggleMenu}
                                    >
                                      {sublink.label}
                                    </Link>
                                  );
                                })}
                              </m.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          className={`relative flex items-center justify-center rounded-full px-6 py-3 text-lg font-semibold transition-all ${isActive
                            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700"
                            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            }`}
                          onClick={toggleMenu}
                        >
                          {link.label}
                        </Link>
                      )}
                    </m.div>
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
