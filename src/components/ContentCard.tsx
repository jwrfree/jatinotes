import { ReactNode } from "react";
import { MotionSection, fadeIn } from "./Animations";

interface ContentCardProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  maxWidth?: "max-w-3xl" | "max-w-4xl" | "max-w-5xl" | "max-w-6xl" | "max-w-7xl";
  animate?: boolean;
  noTopPadding?: boolean;
  noBottomPadding?: boolean;
}

export default function ContentCard({
  children,
  className = "",
  containerClassName = "",
  maxWidth = "max-w-5xl",
  animate = true,
  noTopPadding = false,
  noBottomPadding = false,
}: ContentCardProps) {
  const content = (
    <div className={`mx-auto ${maxWidth} px-3 sm:px-4 ${!noTopPadding ? 'pt-24 sm:pt-40' : ''} ${!noBottomPadding ? 'pb-8 sm:pb-24' : ''} ${containerClassName}`}>
      <div className={`bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-black/5 dark:shadow-white/5 p-6 sm:p-16 ${className}`}>
        {children}
      </div>
    </div>
  );

  if (animate) {
    return (
      <MotionSection
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="relative z-10"
      >
        {content}
      </MotionSection>
    );
  }

  return <section className="relative z-10">{content}</section>;
}
