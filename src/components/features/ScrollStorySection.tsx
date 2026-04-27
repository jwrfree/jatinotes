"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function ScrollStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const line1Y = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const line1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 1, 1]);

  const line2Y = useTransform(scrollYProgress, [0.1, 0.4], [80, 0]);
  const line2Opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.6], [0, 1, 1]);

  const line3Y = useTransform(scrollYProgress, [0.2, 0.5], [60, 0]);
  const line3Opacity = useTransform(scrollYProgress, [0.2, 0.4, 0.7], [0, 1, 1]);

  const gradientScale = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.6]);

  return (
    <section
      ref={containerRef}
      className="relative z-20 py-32 sm:py-40 overflow-hidden"
    >
      {/* Background gradient orb */}
      <m.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-amber-500/20 via-orange-400/10 to-transparent blur-[120px]"
        style={{ scale: gradientScale, opacity: gradientOpacity }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <m.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <m.div
            animate={isInView ? { y: [0, 8, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-5 w-5 text-amber-500/60" />
          </m.div>
        </m.div>

        <m.p
          className="text-lg text-zinc-500 dark:text-zinc-400 sm:text-xl"
          style={{ y: line1Y, opacity: line1Opacity }}
        >
          Saya mulai menulis karena
        </m.p>

        <m.h2
          className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl md:text-7xl"
          style={{ y: line2Y, opacity: line2Opacity }}
        >
          pikiran yang{" "}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            tak dituliskan
          </span>
        </m.h2>

        <m.p
          className="mt-6 text-xl text-zinc-600 dark:text-zinc-400 sm:text-2xl md:text-3xl font-light"
          style={{ y: line3Y, opacity: line3Opacity }}
        >
          akan hilang seperti{" "}
          <span className="italic text-zinc-400 dark:text-zinc-500">
            angin yang tak pernah singgah.
          </span>
        </m.p>

        <m.div
          className="mt-16 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </section>
  );
}
