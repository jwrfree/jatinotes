import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { constructMetadata } from "@/lib/metadata";
import ConditionalLayout from "@/components/ConditionalLayout";
import ScrollToTop from "@/components/ScrollToTop";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { LazyMotionWrapper } from "@/components/LazyMotion";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  ...constructMetadata({
    title: "Jati Notes - Headless WordPress Blog",
    description: "Blog modern menggunakan Next.js dan Headless WordPress",
  }),
  metadataBase: new URL("https://jatinotes.com"),
  title: {
    default: "Jati Notes - Headless WordPress Blog",
    template: "%s | Jati Notes",
  },
  keywords: ["Next.js", "WordPress", "Headless CMS", "React", "Blog"],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-amber-50/60 dark:bg-zinc-950`}
      >
        <LazyMotionWrapper>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <ScrollToTop />
        </LazyMotionWrapper>
        <Analytics />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
