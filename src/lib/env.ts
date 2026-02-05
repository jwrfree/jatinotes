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
  console.error("❌ Invalid environment variables:", envServer.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = envServer.data;
