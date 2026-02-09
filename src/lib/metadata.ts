import { Metadata } from "next";

interface MetadataProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
  url?: string;
  canonical?: string;
  keywords?: string[];
}

const DEFAULT_METADATA = {
  siteName: "Jati Notes",
  defaultDescription: "Blog modern menggunakan Next.js dan Headless WordPress",
  defaultImage: "/og-image.png",
  twitterHandle: "@wruhantojati",
  baseUrl: "https://jatinotes.com",
};

export function constructMetadata({
  title,
  description,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
  url,
  canonical,
  keywords,
}: MetadataProps): Metadata {
  const metaDescription = description || DEFAULT_METADATA.defaultDescription;
  const metaImage = image || DEFAULT_METADATA.defaultImage;
  const metaUrl = url ? `${DEFAULT_METADATA.baseUrl}${url}` : DEFAULT_METADATA.baseUrl;
  const canonicalUrl = canonical || metaUrl;

  return {
    title,
    description: metaDescription,
    ...(keywords && keywords.length > 0 && { keywords }),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: metaDescription,
      url: metaUrl,
      siteName: DEFAULT_METADATA.siteName,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [metaImage],
      creator: DEFAULT_METADATA.twitterHandle,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
