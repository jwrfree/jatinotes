import { z } from "zod";

const envSchema = z.object({
  WORDPRESS_API_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default("https://jatinotes.com"),
});

const envServer = envSchema.safeParse({
  WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!envServer.success) {
  // Hanya log error di production tanpa throw agar tidak 500 total, 
  // tapi kita beri fallback agar fetchAPI bisa memberikan pesan error yang lebih jelas.
  console.error("❌ Invalid environment variables:", envServer.error.flatten().fieldErrors);
  
  if (process.env.NODE_ENV === "production") {
    // Di production kita tetap ingin tahu variabel apa yang kurang
    // tapi kita bisa memberikan nilai default kosong agar app tidak crash saat boot
  }
}

export const env = {
  WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://jatinotes.com",
};
