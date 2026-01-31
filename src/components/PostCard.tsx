"use client";

import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";
import { calculateReadingTime } from "@/lib/utils";
import { sanitize } from "@/lib/sanitize";
import { MotionDiv, fadeIn } from "@/components/Animations";

interface PostCardProps {
  post: Post;
  isWide?: boolean;
  priority?: boolean;
  variant?: "default" | "glass";
  accentColor?: "primary" | "amber";
}

export default function PostCard({ 
  post, 
  isWide = false, 
  priority = false, 
  variant = "default",
  accentColor = "primary"
}: PostCardProps) {
  const accentClasses = {
    primary: "group-hover:text-primary",
    amber: "group-hover:text-amber-500",
  };

  if (variant === "glass") {
    return (
      <MotionDiv
        variants={fadeIn}
        className={`group relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-md transition-all duration-500 hover:shadow-xl ${
          isWide ? "lg:col-span-2 aspect-[3/2]" : "lg:col-span-1 aspect-[3/4]"
        }`}
      >
        <Link href={`/posts/${post.slug}`} className="block h-full w-full relative">
          {post.featuredImage?.node?.sourceUrl && (
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
          
          {/* Glass Effect Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/30 p-4 rounded-xl shadow-2xl transform transition-transform duration-500 group-hover:-translate-y-1">
              <div className="flex items-center gap-x-3 text-[9px] mb-2">
                <span className="text-white/80 font-medium">
                  {calculateReadingTime(post.content || "")} min baca
                </span>
              </div>
              
              <h3 className={`font-bold leading-tight text-white mb-2 transition-colors ${
                accentClasses[accentColor]
              } ${isWide ? "text-xl md:text-2xl" : "text-lg"}`}>
                {post.title}
              </h3>
              
              <div
                className={`text-xs leading-relaxed text-white/90 line-clamp-2 ${isWide ? "md:text-sm" : ""}`}
                dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt) }}
              />
            </div>
          </div>
        </Link>
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      variants={fadeIn}
      className={`group relative flex flex-col bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 ${
        isWide ? "lg:col-span-2" : "lg:col-span-1"
      }`}
    >
      {post.featuredImage?.node?.sourceUrl && (
        <div
          className={`relative w-full overflow-hidden ${
            isWide ? "aspect-[3/2]" : "aspect-[3/4]"
          }`}
        >
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center gap-x-4 text-xs mb-3">
          <span className="relative z-10 rounded-full bg-zinc-50 px-2.5 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {calculateReadingTime(post.content || "")} min
          </span>
        </div>
        
        <h3
          className={`font-bold leading-tight text-zinc-900 dark:text-zinc-50 transition-colors ${
            accentClasses[accentColor]
          } ${isWide ? "text-2xl" : "text-xl"}`}
        >
          <Link href={`/posts/${post.slug}`}>
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h3>
        
        <div
          className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt) }}
        />
      </div>
    </MotionDiv>
  );
}
