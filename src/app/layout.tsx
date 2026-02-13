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
    title: "Jati Notes | Menata Isi Kepala Lewat Tulisan & Buku",
    description: "Ruang berbagi Wruhantojati tentang buku-buku yang mengubah perspektif, catatan desain, hingga perjalanan merapikan isi kepala. Sebuah upaya untuk tetap jujur dan manusiawi.",
    verification: {
      google: "google-site-verification-code", // Placeholder - user needs to update this
    },
  }),
  metadataBase: new URL("https://jatinotes.com"),
  title: {
    default: "Jati Notes | Menata Isi Kepala Lewat Tulisan & Buku",
    template: "%s | Jati Notes",
  },
  keywords: ["Review Buku", "Pengembangan Diri", "Desain Produk", "Catatan Perjalanan", "Humanity", "Jati Notes"],
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
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://jatinotes.com/#person",
    "name": "Wruhantojati",
    "url": "https://jatinotes.com/meet-jati",
    "image": "https://jatinotes.com/jati-profile.jpg",
    "sameAs": [
      "https://twitter.com/wruhantojati",
      "https://linkedin.com/in/wruhantojati",
      "https://github.com/wruhantojati",
      "https://instagram.com/wruhantojati"
    ],
    "jobTitle": "Product Designer",
    "knowsAbout": ["Product Design", "UX Design", "Web Development", "Book Reviews", "Personal Growth"],
    "description": "Desainer produk dan penulis yang fokus pada UX, teknologi, dan pertumbuhan personal melalui Jati Notes."
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://jatinotes.com/#website",
    "name": "Jati Notes",
    "url": "https://jatinotes.com",
    "publisher": { "@id": "https://jatinotes.com/#person" },
    "author": { "@id": "https://jatinotes.com/#person" },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://jatinotes.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    }
  };

  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased dark:bg-zinc-950`}
      >
        <JsonLd data={personJsonLd} />
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
