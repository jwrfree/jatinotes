import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { constructMetadata } from "@/lib/metadata";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import ScrollToTop from "@/components/features/ScrollToTop";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { LazyMotionWrapper } from "@/components/ui/LazyMotion";
import JsonLd from "@/components/features/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  ...constructMetadata({
    title: "Jati Notes - Catatan Perjalanan & Review Buku",
    description: "Blog personal Wruhanto Jati tentang review buku, pengembangan diri, dan teknologi web modern.",
    verification: {
      google: "google-site-verification-code", // Placeholder - user needs to update this
    },
  }),
  metadataBase: new URL("https://jatinotes.com"),
  title: {
    default: "Jati Notes - Catatan Perjalanan & Review Buku",
    template: "%s | Jati Notes",
  },
  keywords: ["Review Buku", "Pengembangan Diri", "Teknologi Web", "Next.js", "React", "Blog Indonesia"],
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
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jati Notes",
    url: "https://jatinotes.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://jatinotes.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Person",
      name: "Wruhanto Jati",
      url: "https://jatinotes.com/meet-jati",
    },
  };

  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-amber-50/60 dark:bg-zinc-950`}
      >
        <JsonLd data={websiteJsonLd} />
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
