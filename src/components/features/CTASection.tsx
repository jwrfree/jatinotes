"use client";

import { useRef } from "react";
import Link from "next/link";
import { m, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Rss } from "lucide-react";

export default function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-15% 0px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={containerRef} className="relative z-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <m.div
          className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 dark:bg-zinc-950 p-12 md:p-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Animated background */}
          <m.div
            className="absolute inset-0"
            style={{ y: bgY }}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px]" />
          </m.div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

          <div className="relative z-10 text-center">
            <m.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"
            >
              <Rss className="h-3.5 w-3.5" />
              Selalu ada yang baru
            </m.div>

            <m.h2
              className="text-3xl font-bold text-white sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Mulai membaca
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                catatan saya
              </span>
            </m.h2>

            <m.p
              className="mx-auto mt-6 max-w-lg text-zinc-400"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Jelajahi tulisan tentang web development, desain, dan buku — semua ditulis dengan penuh perhatian.
            </m.p>

            <m.div
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
              >
                Baca Blog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/buku"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
              >
                Lihat Rak Buku
              </Link>
            </m.div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
