import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jatinotes.com"),
  title: {
    default: "Jati Notes - Headless WordPress Blog",
    template: "%s | Jati Notes",
  },
  description: "Blog modern menggunakan Next.js dan Headless WordPress",
  keywords: ["Next.js", "WordPress", "Headless CMS", "React", "Blog"],
  authors: [{ name: "Wruhantojati" }],
  creator: "Wruhantojati",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://jatinotes.com",
    siteName: "Jati Notes",
    title: "Jati Notes - Headless WordPress Blog",
    description: "Blog modern menggunakan Next.js dan Headless WordPress",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jati Notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jati Notes - Headless WordPress Blog",
    description: "Blog modern menggunakan Next.js dan Headless WordPress",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${inter.className} antialiased bg-white dark:bg-zinc-950`}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <ScrollToTop />
      </body>
    </html>
  );
}
