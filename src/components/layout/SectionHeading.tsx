import Link from 'next/link';

interface SectionHeadingProps {
  children: React.ReactNode;
  viewAllLink?: string;
  className?: string;
  h2ClassName?: string;
}

export default function SectionHeading({
  children,
  viewAllLink,
  className = "",
  h2ClassName = "font-semibold text-zinc-900 dark:text-zinc-50 leading-[1.1]"
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 ${className}`}>
      <div className="max-w-4xl">
        <h2 className={`text-3xl md:text-5xl tracking-tight ${h2ClassName}`}>
          {children}
        </h2>
      </div>
      {viewAllLink && (
        <Link href={viewAllLink} className="group flex items-center gap-3 text-sm font-semibold text-amber-500 shrink-0">
          Lihat Semua
          <span className="w-8 h-px bg-amber-500 transition-all duration-300 group-hover:w-12" />
        </Link>
      )}
    </div>
  );
}
