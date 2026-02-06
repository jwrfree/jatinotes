"use client";

import { useState, useOptimistic } from "react";
import Image from "next/image";
import { sanitize } from "@/lib/sanitize";
import { formatRelativeTime, organizeComments } from "@/lib/utils";
import { Comment } from "@/lib/types";
import CommentForm from "./CommentForm";

// Pattern: Recursive Component with State
const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
  const isOptimistic = comment.id.startsWith("temp-");
  const [showReplies, setShowReplies] = useState(depth < 1); // Auto-show first level of replies, hide deeper ones
  const hasChildren = comment.children && comment.children.length > 0;

  return (
    <div className={`flex flex-col gap-4 ${depth > 0 ? 'ml-8 sm:ml-12 mt-4' : ''} ${isOptimistic ? 'opacity-60 grayscale' : ''}`}>
      <div 
        className={`group relative flex gap-5 p-6 rounded-[2rem] transition-all duration-300 border hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:-translate-y-0.5 ${
          depth > 0 
            ? 'bg-zinc-100/30 dark:bg-zinc-800/20 border-zinc-200/50 dark:border-zinc-700/50' 
            : 'bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800'
        }`}
      >
        <div className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 shadow-sm group-hover:scale-105 transition-transform duration-300 ${depth > 0 ? 'h-10 w-10 sm:h-12 sm:w-12' : ''}`}>
          {comment.author?.node?.avatar?.url ? (
            <Image
              src={comment.author.node.avatar.url}
              alt={comment.author.node.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 40px, 56px"
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center font-bold text-amber-500/60 ${depth > 0 ? 'text-sm' : 'text-lg'}`}>
              {comment.author?.node?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex flex-col">
              <span className={`font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-amber-500 transition-colors ${depth > 0 ? 'text-sm' : 'text-base'}`}>
                {comment.author?.node?.name}
                {isOptimistic && <span className="ml-2 text-[8px] font-normal italic text-zinc-400">(Sedang mengirim...)</span>}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                {formatRelativeTime(comment.date)}
              </span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500">
                {depth > 0 ? 'Balasan' : 'Pembaca'}
              </span>
            </div>
          </div>
          <div 
            className={`text-zinc-600 dark:text-zinc-400 prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400 ${depth > 0 ? 'prose-xs' : 'prose-sm'}`}
            dangerouslySetInnerHTML={{ __html: sanitize(comment.content) }}
          />
          
          <div className="mt-4 flex items-center gap-6">
            <button 
              className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-amber-500 transition-colors group/reply"
              onClick={() => document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 transition-transform group-hover/reply:-translate-x-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              Balas
            </button>

            {hasChildren && (
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-2 text-[10px] font-bold text-amber-500 hover:text-amber-600 transition-colors"
              >
                <span className={`transition-transform duration-300 ${showReplies ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
                {showReplies ? 'Sembunyikan Balasan' : `Lihat ${comment.children?.length} Balasan`}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {hasChildren && showReplies && (
        <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800 -z-10" />
          {comment.children?.map((child) => (
            <CommentItem key={child.id} comment={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface CommentSectionProps {
  comments: Comment[];
  postId: number;
  commentCount: number;
}

export default function CommentSection({ comments, postId, commentCount }: CommentSectionProps) {
  const [displayCount, setDisplayCount] = useState(5);
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: Comment) => [newComment, ...state]
  );

  const commentTree = organizeComments(optimisticComments);
  const visibleComments = commentTree.slice(0, displayCount);
  const hasMore = commentTree.length > displayCount;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
        Diskusi ({commentCount})
      </h2>
      
      {commentTree.length > 0 ? (
        <div className="space-y-6">
          {visibleComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          
          {hasMore && (
            <div className="pt-4 flex justify-center">
              <button 
                onClick={() => setDisplayCount(prev => prev + 5)}
                className="group flex items-center gap-3 px-8 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-bold hover:bg-amber-500 hover:text-white transition-all duration-300"
              >
                Lihat Lebih Banyak Diskusi
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-y-0.5 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-8 text-center border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">Belum ada diskusi. Jadilah yang pertama memberikan tanggapan.</p>
        </div>
      )}
      
      <div className="mt-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2.5rem] p-8 sm:p-12 border border-zinc-100 dark:border-zinc-800">
        <CommentForm postId={postId} onOptimisticAdd={addOptimisticComment} />
      </div>
    </section>
  );
}
