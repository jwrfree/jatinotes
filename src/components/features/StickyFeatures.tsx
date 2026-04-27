"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useInView } from "framer-motion";
import { Sparkles, Zap, Layers, Eye } from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Ditulis dengan Hati",
    description:
      "Setiap tulisan bukan sekadar catatan — tapi refleksi yang dipikirkan matang, disunting, dan disajikan agar mudah dipahami.",
    visual: "from-amber-500/30 via-orange-400/20 to-amber-600/10",
  },
  {
    icon: Zap,
    title: "Cepat & Modern",
    description:
      "Dibangun dengan Next.js 16, React 19, dan Tailwind CSS 4 — performa optimal di setiap perangkat.",
    visual: "from-blue-500/30 via-cyan-400/20 to-blue-600/10",
  },
  {
    icon: Layers,
    title: "Desain Berlapis",
    description:
      "Glassmorphism, motion yang halus, dan tipografi yang diperhatikan — setiap piksel punya tujuan.",
    visual: "from-violet-500/30 via-purple-400/20 to-violet-600/10",
  },
  {
    icon: Eye,
    title: "Fokus Membaca",
    description:
      "Mode gelap, text-to-speech, progress bar, dan navigasi keyboard — pengalaman membaca tanpa gangguan.",
    visual: "from-emerald-500/30 via-teal-400/20 to-emerald-600/10",
  },
];

export default function StickyFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20% 0px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative z-20 py-24 sm:py-32 bg-zinc-50/50 dark:bg-zinc-950/50"
    >
      <div className="mx-auto max-w-7xl px-6">
        <m.div
          className="mb-20 max-w-2xl"
          style={{ y: headingY, opacity: headingOpacity }}
        >
          <span className="mb-4 inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-400">
            Mengapa Jati Notes
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
            Dibuat untuk pengalaman{" "}
            <span className="text-amber-500">membaca terbaik</span>
          </h2>
        </m.div>

        <div className="grid gap-6 md:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <m.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-black/20"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.visual} opacity-0 transition-opacity duration-700 group-hover:opacity-100`}
              />

              <div className="relative z-10">
                <m.div
                  className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <feature.icon className="h-6 w-6" />
                </m.div>

                <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>

              {/* Decorative glow */}
              <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-amber-500/5 blur-3xl transition-all duration-700 group-hover:bg-amber-500/15 group-hover:scale-150" />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
