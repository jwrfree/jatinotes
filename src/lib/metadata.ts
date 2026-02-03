import { Metadata } from "next";

interface MetadataProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  noIndex?: boolean;
  url?: string;
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
  authors,
  noIndex = false,
  url,
}: MetadataProps): Metadata {
  const metaDescription = description || DEFAULT_METADATA.defaultDescription;
  const metaImage = image || DEFAULT_METADATA.defaultImage;
  const metaUrl = url ? `${DEFAULT_METADATA.baseUrl}${url}` : DEFAULT_METADATA.baseUrl;

  return {
    title,
    description: metaDescription,
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
