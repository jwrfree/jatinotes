import Link from 'next/link';
import { Category } from '@/lib/types';

interface BookCategoryStackProps {
  categories: Category[];
}

export default function BookCategoryStack({ categories }: BookCategoryStackProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="lg:col-span-1 flex flex-col justify-center py-4">
      <div className="relative flex flex-col">
        {categories.slice(0, 5).map((cat, index) => {
          const colors = [
            "bg-[#E5E7EB] text-zinc-700", // Soft Grey
            "bg-[#F3E8FF] text-purple-700", // Soft Purple
            "bg-[#DBEAFE] text-blue-700", // Soft Blue
            "bg-[#D1FAE5] text-emerald-700", // Soft Green
            "bg-[#FEF3C7] text-amber-700", // Soft Amber
          ];
          const colorClass = colors[index % colors.length];
          const rotation = (index % 3 - 1) * 2;
          const xOffset = (index % 2 === 0 ? 4 : -4);
          
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative w-full h-32 -mb-12 transition-all duration-500 hover:z-50 hover:-translate-y-6 hover:scale-105"
              style={{ 
                transform: `rotate(${rotation}deg) translateX(${xOffset}px)`,
              }}
            >
              <div className="absolute inset-0 bg-black/5 blur-xl rounded-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className={`absolute inset-0 rounded-lg shadow-sm group-hover:shadow-xl ${colorClass} flex items-center justify-between px-6 border-b-2 border-black/5 overflow-hidden transition-all duration-500`}>
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-black/5" />
                <span className="font-bold text-sm tracking-tight truncate pr-2">
                  {cat.name}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="opacity-60 text-[8px] font-black">
                    {cat.count}
                  </span>
                  <div className="w-1 h-6 bg-white/60 rounded-sm" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
