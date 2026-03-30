"use client";

import { useState, useOptimistic } from "react";
import Image from "next/image";
import { sanitize } from "@/lib/sanitize";
import { formatRelativeTime, organizeComments } from "@/lib/utils";
import { Comment } from "@/lib/types";
import CommentForm from "./CommentForm";

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
      <button
        className={`mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-3 py-1.5 text-left text-xs font-medium text-zinc-500 shadow-sm transition-colors hover:border-amber-500/30 hover:text-amber-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 ${depth > 0 ? "ml-3" : ""}`}
        onClick={() => setIsCollapsed(false)}
      >
        <span>Lihat komentar dari {comment.author?.node?.name}</span>
        <span className="text-zinc-400">{formatRelativeTime(comment.date)}</span>
      </button>
    );
  }

  return (
    <div className={`relative ${depth > 0 ? "mt-4" : "mt-6 sm:mt-8"}`}>
      {depth > 0 && (
        <div className="absolute bottom-4 left-3 top-5 w-px bg-zinc-200/80 dark:bg-zinc-800" />
      )}

      <div className={`relative flex gap-3 ${depth > 0 ? "pl-3 sm:pl-4" : ""}`}>
        <div className={`relative shrink-0 overflow-hidden rounded-full border border-zinc-100 shadow-sm dark:border-zinc-800 ${depth > 0 ? "h-8 w-8" : "h-10 w-10"}`}>
          {comment.author?.node?.avatar?.url ? (
            <Image
              src={comment.author.node.avatar.url}
              alt={comment.author.node.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-xs font-bold text-zinc-500 dark:bg-zinc-800">
              {comment.author?.node?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 rounded-[1.5rem] border border-zinc-200/70 bg-white/80 p-4 shadow-sm shadow-black/5 transition-colors hover:border-amber-500/20 dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-sm font-semibold ${isAuthor ? "text-amber-600 dark:text-amber-500" : "text-zinc-900 dark:text-zinc-100"}`}>
                  {comment.author?.node?.name}
                </span>
                {isAuthor && (
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-600 dark:text-amber-400">
                    Penulis
                  </span>
                )}
                {isOptimistic && (
                  <span className="text-[10px] font-medium italic text-amber-500">
                    Mengirim...
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                {formatRelativeTime(comment.date)}
              </p>
            </div>

            <button
              onClick={() => setIsCollapsed(true)}
              className="rounded-full p-1 text-zinc-300 transition-colors hover:bg-zinc-100 hover:text-zinc-500 dark:hover:bg-zinc-800"
              title="Sembunyikan komentar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div
            className="prose prose-sm max-w-none break-words text-sm leading-7 text-zinc-700 dark:prose-invert dark:text-zinc-300 prose-p:my-1 prose-p:leading-7"
            dangerouslySetInnerHTML={{ __html: sanitize(comment.content) }}
          />

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:text-amber-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              {isReplying ? "Batal" : "Balas"}
            </button>

            {hasChildren && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs font-semibold text-amber-500/80 transition-colors hover:text-amber-600"
              >
                {showReplies ? "Sembunyikan balasan" : `Lihat ${comment.children?.length} balasan`}
              </button>
            )}
          </div>

          {isReplying && (
            <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
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
        <div className="pl-3 sm:pl-5">
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
  const totalComments = Math.max(commentCount, optimisticComments.length);
  const hasComments = totalComments > 0;

  return (
    <section className="mx-auto mt-0 max-w-3xl transition-all duration-300">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:font-bold">
              Diskusi
            </h2>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {totalComments} komentar
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Kalau ada bagian yang terasa dekat, berbeda, atau ingin kamu tambahkan, ruang ini dibuat untuk menanggapi isi tulisan.
          </p>
        </div>

        {hasComments && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-3 py-2 text-xs font-semibold text-zinc-500 shadow-sm transition-colors hover:border-amber-500/30 hover:text-amber-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-amber-500"
          >
            {isExpanded ? "Sembunyikan" : "Lihat Diskusi"}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        )}
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="mb-8 rounded-[2rem] border border-zinc-200/70 bg-white/75 p-6 shadow-xl shadow-black/5 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/75 sm:p-8">
          <CommentForm postId={postId} onOptimisticAdd={addOptimisticComment} />
        </div>

        {hasComments ? (
          <div className="space-y-3">
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
              <div className="flex justify-center pb-6 pt-8">
                <button
                  onClick={() => setDisplayCount((prev) => prev + 5)}
                  className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-600 shadow-sm transition-all duration-300 hover:border-amber-500 hover:text-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  Lihat Lebih Banyak Komentar
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 transition-transform group-hover:translate-y-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-zinc-200/70 bg-white/60 px-6 py-8 text-center shadow-sm shadow-black/5 dark:border-zinc-800 dark:bg-zinc-900/55">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <p className="font-medium text-zinc-800 dark:text-zinc-200">
              Belum ada yang menanggapi tulisan ini.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Kalau ada bagian yang ingin kamu lanjutkan, kamu bisa mulai diskusinya dari sini.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
