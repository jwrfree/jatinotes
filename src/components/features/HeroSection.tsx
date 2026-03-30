"use client";

import { MotionSection, fadeIn } from "../ui/Animations";

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
  description = "Saya percaya bahwa menulis adalah cara terbaik untuk menjernihkan pikiran. Di sini, saya mendokumentasikan perjalanan saya memahami teknologi, desain, dan kompleksitas dunia web modern."
}: HeroSectionProps) {
  return (
    <MotionSection
      initial="initial"
      animate="animate"
      variants={fadeIn}
      className="relative z-10 pt-24 sm:pt-28 pb-14 sm:pb-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-12 bg-amber-500/80" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-400">
              Catatan yang dirawat pelan-pelan
            </span>
          </div>
          <h1 className="mb-5 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl sm:font-bold md:text-7xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            {description}
          </p>
        </div>
      </div>
    </MotionSection>
  );
}
