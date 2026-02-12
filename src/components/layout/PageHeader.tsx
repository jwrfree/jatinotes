import { ReactNode } from "react";
import { sanitize } from "@/lib/sanitize";
import DecryptedText from "../ui/DecryptedText";

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  description?: string;
  className?: string;
  titleClassName?: string;
  useDecryptedText?: boolean;
  accent?: ReactNode;
  topContent?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  description,
  className = "",
  titleClassName = "text-4xl font-semibold sm:font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl leading-tight",
  useDecryptedText = false,
  accent,
  topContent,
}: PageHeaderProps) {
  return (
    <header className={`flex flex-col ${className}`}>
      {topContent && (
        <div className="mb-3">
          {topContent}
        </div>
      )}

      <h1 className={titleClassName}>
        {useDecryptedText ? (
          <DecryptedText
            text={title}
            animateOn="view"
            revealDirection="start"
            sequential={true}
            useOriginalCharsOnly={false}
            className="text-inherit"
            encryptedClassName="text-amber-500 opacity-50"
          />
        ) : (
          title.replace(/[“”]/g, '"')
        )}
      </h1>

      {accent && (
        <div className="mt-4">
          {accent}
        </div>
      )}

      {subtitle && (
        <div className="mt-4">
          {subtitle}
        </div>
      )}

      {description && (
        <div
          className="mt-4 text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitize(description) }}
        />
      )}
    </header>
  );
}

