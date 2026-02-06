import { z } from "zod";

const envSchema = z.object({
  WORDPRESS_API_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default("https://jatinotes.com"),
});

const envServer = envSchema.safeParse({
  WORDPRESS_API_URL: process.env.WORDPRESS_API_URL?.trim(),
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL?.trim(),
});

if (!envServer.success) {
  console.error("❌ Invalid environment variables:", envServer.error.flatten().fieldErrors);
  // Only throw in build/dev, in production try to keep it alive for better debugging
  if (process.env.NODE_ENV !== "production") {
    throw new Error("Invalid environment variables");
  }
}

export const env = envServer.success ? envServer.data : {
  WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://jatinotes.com",
};
