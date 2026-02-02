"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Post } from "@/lib/types";
import { sanitize } from "@/lib/sanitize";
import { MotionDiv, fadeIn } from "@/components/Animations";

interface PostCardProps {
  post: Post;
  isWide?: boolean;
  priority?: boolean;
  variant?: "default" | "glass";
  accentColor?: "amber";
}

export default function PostCard({ 
  post, 
  isWide = false, 
  priority = false, 
  variant = "default",
  accentColor = "amber"
}: PostCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const accentClasses = {
    amber: "group-hover:text-amber-500",
  };

  if (variant === "glass") {
    return (
      <MotionDiv
        ref={containerRef}
        variants={fadeIn}
        className={`group relative overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800 shadow-md transition-all duration-500 hover:shadow-xl ${
          isWide ? "lg:col-span-2" : "lg:col-span-1"
        } aspect-[3/4] md:aspect-auto md:h-[450px]`}
      >
        <Link href={`/posts/${post.slug}`} className="block h-full w-full relative">
          {post.featuredImage?.node?.sourceUrl && (
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                style={{ y, height: "120%", top: "-10%" }}
                className="relative w-full"
              >
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.title}
                  fill
                  priority={priority}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />
          
          {/* Glass Effect Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 p-5 md:p-6 h-[42%] flex flex-col justify-center border-t border-white/10 transition-colors group-hover:bg-white/15">
              <h3 className={`font-medium leading-tight text-white mb-2 transition-colors ${
                accentClasses[accentColor]
              } ${isWide ? "text-lg md:text-xl" : "text-base"}`}>
                {post.title}
              </h3>
              
              <div
                className={`text-[10px] md:text-xs leading-relaxed text-zinc-300 line-clamp-2 opacity-90`}
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
      ref={containerRef}
      variants={fadeIn}
      className={`group relative flex flex-col bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 ${
        isWide ? "lg:col-span-2" : "lg:col-span-1"
      }`}
    >
      {post.featuredImage?.node?.sourceUrl && (
        <div
          className={`relative w-full overflow-hidden ${
            isWide ? "aspect-[3/2]" : "aspect-[3/4]"
          }`}
        >
          <motion.div 
            style={{ y, height: "120%", top: "-10%" }}
            className="relative w-full h-full"
          >
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
        </div>
      )}
      <div className="flex flex-col flex-grow p-6">
        <h3
          className={`font-medium leading-tight text-zinc-900 dark:text-zinc-50 transition-colors ${
            accentClasses[accentColor]
          } ${isWide ? "text-xl" : "text-lg"}`}
        >
          <Link href={`/posts/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        <div
          className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 flex-grow"
          dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt) }}
        />
        <div className="mt-6 flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <span className="text-[10px] font-bold">JN</span>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Jati Notes</span>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
}
