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
  topContentClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
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
  topContentClassName = "mb-4",
  subtitleClassName = "mt-6",
  descriptionClassName = "mt-5 max-w-3xl text-sm md:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed",
}: PageHeaderProps) {
  return (
    <header className={`flex flex-col ${className}`}>
      {topContent && (
        <div className={topContentClassName}>
          {topContent}
        </div>
      )}

      <h1 className={`max-w-4xl ${titleClassName}`}>
        {useDecryptedText ? (
          <DecryptedText
            text={title}
            animateOn="hover"
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
        <div className={subtitleClassName}>
          {subtitle}
        </div>
      )}

      {description && (
        <div
          className={descriptionClassName}
          dangerouslySetInnerHTML={{ __html: sanitize(description) }}
        />
      )}
    </header>
  );
}
