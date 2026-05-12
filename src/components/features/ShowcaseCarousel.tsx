"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { m, useScroll, useTransform, useInView, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Pen, Code2, BookOpen } from "lucide-react";
import ScrollReveal3D from "@/components/ui/ScrollReveal3D";

const SHOWCASE_ITEMS = [
  {
    icon: Pen,
    title: "Blog Pribadi",
    description:
      "Catatan dan refleksi dari perjalanan belajar saya — tentang web development, desain, dan hal-hal yang membuat saya penasaran.",
    color: "from-amber-500/20 to-orange-500/10",
    accent: "text-amber-500",
    link: "/blog",
  },
  {
    icon: Code2,
    title: "Eksperimen Teknis",
    description:
      "Eksplorasi mendalam tentang Next.js, React, Tailwind CSS, dan teknologi web modern lainnya yang saya gunakan sehari-hari.",
    color: "from-blue-500/20 to-cyan-500/10",
    accent: "text-blue-500",
    link: "/teknologi",
  },
  {
    icon: BookOpen,
    title: "Catatan Bacaan",
    description:
      "Ringkasan dan refleksi dari buku-buku yang telah saya baca — dari self-improvement sampai teknologi.",
    color: "from-emerald-500/20 to-teal-500/10",
    accent: "text-emerald-500",
    link: "/buku",
  },
];

export default function ShowcaseCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-15% 0px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.4], [80, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && currentIndex < SHOWCASE_ITEMS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <section ref={containerRef} className="relative z-20 py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <m.div
          className="mb-16 text-center"
          style={{ y: headingY, opacity: headingOpacity }}
        >
          <span className="mb-4 inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-400">
            Jelajahi
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
            Tiga Dunia dalam <span className="text-amber-500">Satu Tempat</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-600 dark:text-zinc-400">
            Swipe atau klik untuk menjelajahi setiap kategori yang saya tulis.
          </p>
        </m.div>

        {/* Desktop grid with 3D scroll reveal */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {SHOWCASE_ITEMS.map((item, i) => (
            <ScrollReveal3D
              key={item.title}
              rotateXFrom={-50}
              scaleFrom={0.88}
              yFrom={60}
              origin="bottom center"
              offset={["start end", "center center"]}
            >
              <m.div
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Link
                  href={item.link}
                  className="group relative flex flex-col rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl p-8 transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-black/20"
                >
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />
                  <div className="relative z-10">
                    <div
                      className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 ${item.accent} transition-transform duration-500 group-hover:scale-110`}
                    >
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {item.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Jelajahi
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </m.div>
            </ScrollReveal3D>
          ))}
        </div>

        {/* Mobile swipeable */}
        <div className="md:hidden relative">
          <m.div
            className="flex cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: -(SHOWCASE_ITEMS.length - 1) * 300, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={{ x: -currentIndex * 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {SHOWCASE_ITEMS.map((item, i) => (
              <m.div
                key={item.title}
                className="min-w-[280px] mr-5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link
                  href={item.link}
                  className="flex flex-col rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl p-6"
                >
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 ${item.accent}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                </Link>
              </m.div>
            ))}
          </m.div>

          {/* Dots indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {SHOWCASE_ITEMS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-8 bg-amber-500"
                    : "w-2 bg-zinc-300 dark:bg-zinc-600"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Nav arrows */}
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="rounded-full p-2 border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(SHOWCASE_ITEMS.length - 1, prev + 1)
                )
              }
              disabled={currentIndex === SHOWCASE_ITEMS.length - 1}
              className="rounded-full p-2 border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Selanjutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
