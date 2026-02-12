import Link from "next/link";
import Image from "next/image";
import { Book } from "lucide-react";
import { Post } from "@/lib/types";
import { getBookTitle, getBookAuthor } from "@/lib/book-utils";

interface SimpleBookCardProps {
  post: Post;
}

export default function SimpleBookCard({ post }: SimpleBookCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block h-full">
      <div className="aspect-[2/3] relative overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800 mb-4 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-300 group-hover:shadow-md">
        {post.featuredImage?.node?.sourceUrl ? (
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Book size={24} className="text-zinc-400" />
          </div>
        )}
      </div>
      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-amber-600 transition-colors text-lg">
        {getBookTitle(post)}
      </h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
        {getBookAuthor(post)}
      </p>
    </Link>
  );
}
