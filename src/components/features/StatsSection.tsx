"use client";

import { useRef, useEffect, useState } from "react";
import { m, useInView, useSpring, useMotionValue } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  isInView: boolean;
}

function AnimatedCounter({ value, suffix = "", isInView }: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return unsubscribe;
  }, [spring]);

  return (
    <span className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

const STATS = [
  { value: 50, suffix: "+", label: "Catatan Diterbitkan" },
  { value: 30, suffix: "+", label: "Buku Diulas" },
  { value: 100, suffix: "%", label: "Open Source" },
  { value: 10, suffix: "K+", label: "Kata Ditulis" },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section className="relative z-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <m.div
          ref={ref}
          className="relative overflow-hidden rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-12 md:p-16"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />

          <div className="relative z-10 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            {STATS.map((stat, i) => (
              <m.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 md:text-5xl">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isInView={isInView}
                  />
                </div>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </p>
              </m.div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
