"use client";

import { useState, useOptimistic } from "react";
import Image from "next/image";
import { sanitize } from "@/lib/sanitize";
import { formatRelativeTime, organizeComments } from "@/lib/utils";
import { Comment } from "@/lib/types";
import CommentForm from "./CommentForm";

// Pattern: Recursive Component with State
// Pattern: Recursive Component with State
const CommentItem = ({
  comment,
  depth = 0,
  postId,
  onOptimisticAdd,
  postAuthorName
}: {
  comment: Comment;
  depth?: number;
  postId: string;
  onOptimisticAdd: (comment: Comment) => void;
  postAuthorName?: string;
}) => {
  const isOptimistic = comment.id.startsWith("temp-");
  const [showReplies, setShowReplies] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasChildren = comment.children && comment.children.length > 0;

  const isAuthor = postAuthorName && comment.author?.node?.name === postAuthorName;

  if (isCollapsed) {
    return (
      <div
        className={`mt-4 ${depth > 0 ? '' : 'mb-4'} cursor-pointer group flex items-center gap-3`}
        onClick={() => setIsCollapsed(false)}
      >
        {depth > 0 && <div className="w-4 h-px bg-zinc-200 dark:bg-zinc-800" />}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/10 border border-transparent hover:border-amber-200 transition-all">
          <span className="text-xs font-semibold text-zinc-500 group-hover:text-amber-600 transition-colors">
            [+] {comment.author?.node?.name}
          </span>
          <span className="text-[10px] text-zinc-400">
            {formatRelativeTime(comment.date)}
          </span>
          {hasChildren && (
            <span className="text-[10px] text-zinc-400 bg-zinc-200 dark:bg-zinc-700 px-1.5 rounded-md">
              {comment.children?.length}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col relative ${depth > 0 ? 'ml-0 mt-4' : 'mt-8'}`}>
      {/* Thread Line for children - Clickable to collapse */}
      {depth > 0 && (
        <div
          className="absolute -left-4 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800 hover:bg-amber-500 hover:w-0.5 cursor-pointer transition-all z-10"
          onClick={() => setIsCollapsed(true)}
          title="Klik untuk menyembunyikan utas ini"
        />
      )}

      <div className={`group relative flex gap-3 sm:gap-4 ${depth > 0 ? 'pl-4' : ''}`}>

        {/* Avatar */}
        <div className={`relative shrink-0 overflow-hidden rounded-full border border-zinc-100 dark:border-zinc-800 shadow-sm ${depth > 0 ? 'h-8 w-8' : 'h-10 w-10'}`}>
          {comment.author?.node?.avatar?.url ? (
            <Image
              src={comment.author.node.avatar.url}
              alt={comment.author.node.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold text-xs">
              {comment.author?.node?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 hover:border-amber-500/30 transition-colors">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-semibold sm:font-bold text-sm ${isAuthor ? 'text-amber-600 dark:text-amber-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                {comment.author?.node?.name}
              </span>

              {isAuthor && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 text-[10px] font-semibold backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-blue-500">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  Penulis
                </span>
              )}

              {isOptimistic && <span className="text-[10px] italic text-amber-500 animate-pulse">(Mengirim...)</span>}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-zinc-400 font-medium">
                {formatRelativeTime(comment.date)}
              </span>
              <button
                onClick={() => setIsCollapsed(true)}
                className="text-zinc-300 hover:text-zinc-500 p-1"
                title="Sembunyikan komentar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className="text-sm text-zinc-600 dark:text-zinc-300 prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-p:leading-relaxed break-words"
            dangerouslySetInnerHTML={{ __html: sanitize(comment.content) }}
          />

          <div className="mt-3 flex items-center gap-4 select-none">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs font-semibold text-zinc-400 hover:text-amber-500 transition-colors flex items-center gap-1.5 py-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              {isReplying ? "Batal" : "Balas"}
            </button>

            {hasChildren && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs font-semibold text-amber-500/80 hover:text-amber-600 transition-colors flex items-center gap-1"
              >
                {showReplies ? "Sembunyikan" : `Lihat ${comment.children?.length} Balasan`}
              </button>
            )}
          </div>

          {/* Inline Reply Form */}
          {isReplying && (
            <div className="mt-4 pl-0 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onCancel={() => setIsReplying(false)}
                onOptimisticAdd={onOptimisticAdd}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {hasChildren && showReplies && (
        <div className="pl-4 sm:pl-6 relative">
          {/* Recursive Children */}
          {comment.children?.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              depth={depth + 1}
              postId={postId}
              onOptimisticAdd={onOptimisticAdd}
              postAuthorName={postAuthorName}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
  commentCount: number;
  postAuthorName?: string;
}

export default function CommentSection({ comments, postId, commentCount, postAuthorName }: CommentSectionProps) {
  const [displayCount, setDisplayCount] = useState(5);
  const [isExpanded, setIsExpanded] = useState(true);
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: Comment) => [newComment, ...state]
  );

  const commentTree = organizeComments(optimisticComments);
  const visibleComments = commentTree.slice(0, displayCount);
  const hasMore = commentTree.length > displayCount;

  return (
    <section className="mt-0 max-w-3xl mx-auto transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-8 group cursor-pointer select-none"
      >
        <h2 className="text-2xl font-semibold sm:font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
          Diskusi
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 001.28.53l3.58-3.579a.78.78 0 01.527-.224 41.202 41.202 0 005.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zm0 7a1 1 0 100-2 1 1 0 000 2zM8 8a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {commentCount} {commentCount === 1 ? 'komentar' : 'komentar'}
          </span>
        </h2>

        <div className={`p-2 rounded-full bg-zinc-50 dark:bg-zinc-800/50 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 text-zinc-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mb-12 bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800">
          <CommentForm postId={postId} onOptimisticAdd={addOptimisticComment} />
        </div>

        {commentTree.length > 0 ? (
          <div className="space-y-2">
            {visibleComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                onOptimisticAdd={addOptimisticComment}
                postAuthorName={postAuthorName}
              />
            ))}

            {hasMore && (
              <div className="pt-8 flex justify-center pb-12">
                <button
                  onClick={() => setDisplayCount(prev => prev + 5)}
                  className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-semibold hover:border-amber-500 hover:text-amber-500 transition-all duration-300 shadow-sm"
                >
                  Lihat Lebih Banyak Komentar
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-y-0.5 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="mx-auto w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl mb-4 grayscale opacity-50">💬</div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Belum ada diskusi.</p>
            <p className="text-sm text-zinc-400 mt-1">Jadilah yang pertama memberikan tanggapan!</p>
          </div>
        )}
      </div>
    </section>
  );
}
