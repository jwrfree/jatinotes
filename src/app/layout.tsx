import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { constructMetadata } from "@/lib/metadata";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";

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
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <ScrollToTop />
        <Analytics />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
