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
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
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
        parentId: parentId || null,
        children: [],
      };
      startTransition(() => {
        onOptimisticAdd(optimisticComment);
      });

      if (onCancel) onCancel();
    }

    try {
      const res = await submitCommentAction({
        ...formData,
        postId,
        parentId
      });

      if (res?.success) {
        setStatus("success");
        setMessage(res.message);
        toast.success(res.message);
        setFormData({ author: "", authorEmail: "", content: "", website: "" });
        setErrors({});
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
        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:font-bold">
                Tinggalkan Komentar
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Nama akan tampil di komentar. Email tetap privat dan tidak dipublikasikan.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" id={isReply ? `reply-form-${parentId}` : "comment-form"}>
        <div className="absolute -z-10 h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <input
              type="text"
              name="author"
              id={`comment-author${isReply ? `-${parentId}` : ""}`}
              autoComplete="name"
              placeholder="Nama yang ingin ditampilkan"
              className={`block w-full rounded-2xl border bg-white/70 px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-500 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:bg-zinc-950/70 dark:text-zinc-100 dark:placeholder:text-zinc-400 ${
                errors.author ? "border-red-300 focus:border-red-500" : "border-zinc-200/70 dark:border-zinc-800"
              }`}
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
            {errors.author && <p className="mt-2 text-xs text-red-500">{errors.author}</p>}
          </div>

          <div>
            <input
              type="email"
              name="authorEmail"
              id={`comment-email${isReply ? `-${parentId}` : ""}`}
              autoComplete="email"
              placeholder="Email (tetap privat)"
              className={`block w-full rounded-2xl border bg-white/70 px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-500 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:bg-zinc-950/70 dark:text-zinc-100 dark:placeholder:text-zinc-400 ${
                errors.authorEmail ? "border-red-300 focus:border-red-500" : "border-zinc-200/70 dark:border-zinc-800"
              }`}
              value={formData.authorEmail}
              onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
            />
            {errors.authorEmail && <p className="mt-2 text-xs text-red-500">{errors.authorEmail}</p>}
          </div>
        </div>

        <div>
          <textarea
            name="content"
            id={`comment-content${isReply ? `-${parentId}` : ""}`}
            rows={isReply ? 3 : 6}
            placeholder={isReply ? "Tulis balasanmu..." : "Tulis tanggapanmu di sini..."}
            autoFocus={autoFocus}
            className={`block w-full resize-none rounded-2xl border bg-white/70 px-4 py-3 text-sm leading-7 text-zinc-900 outline-none transition-all placeholder:text-zinc-500 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:bg-zinc-950/70 dark:text-zinc-100 dark:placeholder:text-zinc-400 ${
              errors.content ? "border-red-300 focus:border-red-500" : "border-zinc-200/70 dark:border-zinc-800"
            }`}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
          {errors.content && <p className="mt-2 text-xs text-red-500">{errors.content}</p>}
        </div>

        {message && (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${
            status === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 sm:w-auto"
          >
            {status === "submitting" ? "Mengirim..." : (isReply ? "Kirim Balasan" : "Kirim Komentar")}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:border-zinc-800 dark:hover:bg-zinc-900 sm:w-auto"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
