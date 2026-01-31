"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40
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
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-md dark:bg-zinc-950/80 shadow-xl shadow-black/5 dark:shadow-white/5" 
          : "bg-transparent"
      }`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 z-50">
            Jati<span className="text-primary">Notes</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-sm font-medium text-zinc-600 hover:text-primary transition-colors dark:text-zinc-400 dark:hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

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
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-white dark:bg-zinc-950 md:hidden"
          >
            <div className="flex flex-col items-center space-y-8 p-6 text-center">
              {links.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-3xl font-bold text-zinc-900 hover:text-primary dark:text-zinc-50 dark:hover:text-primary"
                  onClick={toggleMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
