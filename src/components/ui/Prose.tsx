import { ReactNode } from "react";
import { sanitize } from "@/lib/sanitize";

interface ProseProps {
  children?: ReactNode;
  content?: string;
  className?: string;
  size?: "base" | "lg" | "xl";
}

export default function Prose({
  children,
  content,
  className = "",
  size = "lg",
}: ProseProps) {
  const sizeClasses = {
    base: "prose-sm md:prose-base",
    lg: "prose-base md:prose-lg",
    xl: "prose-lg md:prose-xl",
  };

  const baseClasses = "prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-28 prose-p:leading-relaxed prose-p:text-zinc-800 dark:prose-p:text-zinc-200 prose-a:text-amber-500 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50";

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;

  if (content) {
    return (
      <div
        className={combinedClasses}
        dangerouslySetInnerHTML={{ __html: sanitize(content) }}
      />
    );
  }

  return <div className={combinedClasses}>{children}</div>;
}
