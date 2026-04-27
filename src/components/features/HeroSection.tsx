"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";

interface HeroSectionProps {
  title?: React.ReactNode;
  description?: string;
}

export default function HeroSection({
  title = (
    <>
      Mengapa Saya <span className="text-amber-500 italic">Menulis?</span>
    </>
  ),
  description = "Saya percaya bahwa menulis adalah cara terbaik untuk menjernihkan pikiran. Di sini, saya mendokumentasikan perjalanan saya memahami teknologi, desain, dan kompleksitas dunia web modern.",
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const descY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const descOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const badgeScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section ref={containerRef} className="relative z-10 pt-24 sm:pt-28 pb-14 sm:pb-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <m.div
            className="mb-5 flex items-center gap-4"
            style={{ scale: badgeScale, opacity: badgeOpacity }}
          >
            <span className="h-px w-12 bg-amber-500/80" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-400">
              Catatan yang dirawat pelan-pelan
            </span>
          </m.div>

          {/* Entrance animation wrapper */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Scroll-driven parallax */}
            <m.h1
              className="mb-5 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl sm:font-bold md:text-7xl"
              style={{ y: titleY, opacity: titleOpacity }}
            >
              {title}
            </m.h1>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <m.p
              className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg"
              style={{ y: descY, opacity: descOpacity }}
            >
              {description}
            </m.p>
          </m.div>
        </div>
      </div>
    </section>
  );
}
