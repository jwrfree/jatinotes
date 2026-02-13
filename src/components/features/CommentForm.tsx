"use client";

import { useState, startTransition } from "react";
import { submitCommentAction } from "@/lib/actions";
import { toast } from "sonner";
import { Comment } from "@/lib/types";

interface CommentFormProps {
  postId: string;
  onOptimisticAdd?: (comment: Comment) => void;
  parentId?: string | null;
  onCancel?: () => void;
  autoFocus?: boolean;
}

export default function CommentForm({ postId, onOptimisticAdd, parentId, onCancel, autoFocus }: CommentFormProps) {
  const [formData, setFormData] = useState({
    author: "",
    authorEmail: "",
    content: "",
    website: "", // Honeypot field
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    // Check honeypot
    if (formData.website) {
      console.warn("Bot detected via honeypot");
      return false;
    }

    const newErrors: { [key: string]: string } = {};
    if (!formData.author.trim()) newErrors.author = "Nama wajib diisi";
    if (!formData.authorEmail.trim()) {
      newErrors.authorEmail = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.authorEmail)) {
      newErrors.authorEmail = "Format email tidak valid";
    }
    if (!formData.content.trim()) newErrors.content = "Komentar tidak boleh kosong";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("submitting");
    setMessage("");
    setErrors({});

    // Create optimistic comment
    if (onOptimisticAdd) {
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        date: new Date().toISOString(),
        content: formData.content,
        author: {
          node: {
            name: formData.author,
            avatar: {
              url: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.author)}&background=random`,
            },
          },
        },
        parentId: parentId || null, // Connect to parent
        children: [],
      };
      startTransition(() => {
        onOptimisticAdd(optimisticComment);
      });

      // Close reply form immediately if optimistic
      if (onCancel) onCancel();
    }

    try {
      const res = await submitCommentAction({
        ...formData,
        postId,
        parentId // Send parentId to server
      });

      if (res?.success) {
        setStatus("success");
        setMessage(res.message);
        toast.success(res.message);
        setFormData({ author: "", authorEmail: "", content: "", website: "" });
        setErrors({});
        // If reply mode, maybe close after success if not optimistic handled
        if (onCancel && !onOptimisticAdd) setTimeout(onCancel, 2000);
      } else {
        setStatus("error");
        const errorMsg = res?.message || "Gagal mengirim komentar.";
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      const errorMsg = "Terjadi kesalahan sistem.";
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  const isReply = !!parentId;

  return (
    <div className={`w-full ${isReply ? "mt-4 animate-in fade-in slide-in-from-top-2" : ""}`}>
      {!isReply && (
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold sm:font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Tinggalkan Komentar
          </h3>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" id={isReply ? `reply-form-${parentId}` : "comment-form"}>
        {/* Honeypot */}
        <div className="absolute opacity-0 -z-10 h-0 w-0 overflow-hidden" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Nama Lengkap"
            className={`block w-full rounded-xl border bg-white/50 backdrop-blur-sm px-4 py-3 text-sm text-zinc-900 transition-all focus:ring-4 focus:ring-amber-500/10 outline-none ${errors.author ? 'border-red-300 focus:border-red-500' : 'border-zinc-200/50 focus:border-amber-500'}`}
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email (tidak dipublikasikan)"
            className={`block w-full rounded-xl border bg-white/50 backdrop-blur-sm px-4 py-3 text-sm text-zinc-900 transition-all focus:ring-4 focus:ring-amber-500/10 outline-none ${errors.authorEmail ? 'border-red-300 focus:border-red-500' : 'border-zinc-200/50 focus:border-amber-500'}`}
            value={formData.authorEmail}
            onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
          />
        </div>

        <textarea
          rows={isReply ? 3 : 5}
          placeholder={isReply ? "Tulis balasan Anda..." : "Tulis komentar..."}
          autoFocus={autoFocus}
          className={`block w-full rounded-xl border bg-white/50 backdrop-blur-sm px-4 py-3 text-sm text-zinc-900 transition-all focus:ring-4 focus:ring-amber-500/10 outline-none resize-none ${errors.content ? 'border-red-300 focus:border-red-500' : 'border-zinc-200/50 focus:border-amber-500'}`}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />

        {message && (
          <div className={`text-xs p-3 rounded-lg ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
          >
            {status === "submitting" ? "Mengirim..." : (isReply ? "Balas" : "Kirim Komentar")}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
