"use client";

import { MotionSection, fadeIn } from "./Animations";

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
      className="relative z-10 pt-32 sm:pt-40 pb-24 sm:pb-32"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold sm:font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl mb-6">
            {title}
          </h1>
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>
      </div>
    </MotionSection>
  );
}
