"use client";

import { useState } from "react";
import { submitCommentAction } from "@/lib/actions";

export default function CommentForm({ postId }: { postId: number }) {
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

    try {
      const res = await submitCommentAction({
        ...formData,
        postId,
      });

      if (res?.success) {
        setStatus("success");
        setMessage(res.message);
        setFormData({ author: "", authorEmail: "", content: "", website: "" });
        setErrors({});
      } else {
        setStatus("error");
        setMessage(res?.message || "Gagal mengirim komentar. Silakan coba lagi.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Terjadi kesalahan sistem saat menghubungi server.");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Tinggalkan Komentar
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot field - Hidden from users */}
        <div className="absolute opacity-0 -z-10 h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="author"
              className={`text-sm font-semibold ml-1 transition-colors ${errors.author ? 'text-red-500' : 'text-zinc-700 dark:text-zinc-300'}`}
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="author"
              placeholder="Masukkan nama Anda..."
              className={`block w-full rounded-2xl border bg-white px-4 py-3 text-zinc-900 transition-all focus:ring-4 outline-none ${
                errors.author 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10 dark:border-red-900/50' 
                  : 'border-zinc-200 focus:border-primary focus:ring-primary/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-primary dark:focus:ring-primary/20'
              }`}
              value={formData.author}
              onChange={(e) => {
                setFormData({ ...formData, author: e.target.value });
                if (errors.author) setErrors({ ...errors, author: "" });
              }}
            />
            {errors.author && <p className="text-[11px] font-bold text-red-500 ml-1 uppercase tracking-wider">{errors.author}</p>}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className={`text-sm font-semibold ml-1 transition-colors ${errors.authorEmail ? 'text-red-500' : 'text-zinc-700 dark:text-zinc-300'}`}
            >
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="nama@email.com"
              className={`block w-full rounded-2xl border bg-white px-4 py-3 text-zinc-900 transition-all focus:ring-4 outline-none ${
                errors.authorEmail 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10 dark:border-red-900/50' 
                  : 'border-zinc-200 focus:border-primary focus:ring-primary/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-primary dark:focus:ring-primary/20'
              }`}
              value={formData.authorEmail}
              onChange={(e) => {
                setFormData({ ...formData, authorEmail: e.target.value });
                if (errors.authorEmail) setErrors({ ...errors, authorEmail: "" });
              }}
            />
            {errors.authorEmail && <p className="text-[11px] font-bold text-red-500 ml-1 uppercase tracking-wider">{errors.authorEmail}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="content"
            className={`text-sm font-semibold ml-1 transition-colors ${errors.content ? 'text-red-500' : 'text-zinc-700 dark:text-zinc-300'}`}
          >
            Pesan Komentar
          </label>
          <textarea
            id="content"
            rows={5}
            placeholder="Tuliskan pemikiran Anda di sini..."
            className={`block w-full rounded-3xl border bg-white px-4 py-4 text-zinc-900 transition-all focus:ring-4 outline-none resize-none ${
              errors.content 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10 dark:border-red-900/50' 
                : 'border-zinc-200 focus:border-primary focus:ring-primary/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-primary dark:focus:ring-primary/20'
            }`}
            value={formData.content}
            onChange={(e) => {
              setFormData({ ...formData, content: e.target.value });
              if (errors.content) setErrors({ ...errors, content: "" });
            }}
          />
          {errors.content && <p className="text-[11px] font-bold text-red-500 ml-1 uppercase tracking-wider">{errors.content}</p>}
        </div>

        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
            status === "success" 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
              : "bg-red-50 text-red-700 border border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
          }`}>
            {status === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-primary/40 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        >
          {status === "submitting" ? (
            <>
              <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Mengirim Komentar...</span>
            </>
          ) : (
            <>
              <span>Kirim Komentar</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
