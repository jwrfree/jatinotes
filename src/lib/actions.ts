"use server";

import { createComment } from "./api";
import { revalidatePath } from "next/cache";

const SPAM_KEYWORDS = [
  'slot', 'gacor', 'judol', 'casino', 'bet', 'poker', 'togel', 'jp',
  'maxwin', 'zeus', 'pragmatic', 'sbobet', 'bandar', 'jackpot',
  'viagra', 'cialis', 'porn', 'sex', 'dating', 'crypto', 'bitcoin',
  'forex', 'trading', 'loan', 'insurance', 'marketing'
];

export async function submitCommentAction(formData: {
  author: string;
  authorEmail: string;
  content: string;
  postId: string; // Updated to string for Sanity ID
  parentId?: string | null;
  website?: string; // Honeypot field
}) {
  try {
    // 0. Server-side Honeypot Check
    if (formData.website) {
      console.warn("Bot detected via server-side honeypot");
      return { success: false, message: "Akses ditolak." };
    }

    // 1. Basic Content Validation
    if (formData.content.length > 2000) {
      return { success: false, message: "Komentar terlalu panjang (maksimal 2000 karakter)." };
    }

    const lowercaseContent = formData.content.toLowerCase();
    const hasSpamKeyword = SPAM_KEYWORDS.some(keyword => lowercaseContent.includes(keyword));

    // 2. Link Detection (excessive links are often spam)
    const urlCount = (formData.content.match(/https?:\/\/[^\s]+/g) || []).length;

    if (hasSpamKeyword || urlCount > 2) {
      console.warn(`Spam detected in comment: keyword=${hasSpamKeyword}, urls=${urlCount}`);
      return { success: false, message: "Komentar Anda terdeteksi sebagai spam." };
    }

    // 3. Simple text sanitization (strip all HTML tags)
    const sanitizedContent = formData.content
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .trim();

    if (!sanitizedContent.trim()) {
      return { success: false, message: "Isi komentar tidak valid." };
    }

    // Call Repository directly (which uses Sanity Client)
    const res = await createComment({
      ...formData,
      content: sanitizedContent
    });

    if (res?.success) {
      // revalidatePath cannot be used here accurately without slug, relying on ISR
      return { success: true, message: "Komentar berhasil dikirim dan menunggu moderasi." };
    } else {
      return { success: false, message: res?.message || "Gagal mengirim komentar." };
    }
  } catch (error) {
    console.error("Action error:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}
