import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const CommentRepository = {
  create: async (input: {
    content: string;
    author: string;
    authorEmail: string;
    postId: string;
  }) => {
    try {
      // Create client with write token strictly on server side
      const client = createClient({
        projectId,
        dataset,
        apiVersion,
        token: process.env.SANITY_API_WRITE_TOKEN,
        useCdn: false,
      });

      if (!process.env.SANITY_API_WRITE_TOKEN) {
        console.error("Missing SANITY_API_WRITE_TOKEN");
        return { success: false, message: "Konfigurasi server belum lengkap." };
      }

      const result = await client.create({
        _type: 'comment',
        name: input.author,
        email: input.authorEmail,
        comment: input.content,
        post: {
          _type: 'reference',
          _ref: input.postId
        },
        approved: false
      });

      return { success: true, message: "Komentar berhasil dikirim dan menunggu moderasi." };
    } catch (error) {
      console.error("Sanity create error:", error);
      return { success: false, message: "Gagal menyimpan komentar." };
    }
  },
};
