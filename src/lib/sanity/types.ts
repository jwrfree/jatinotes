
import { PortableTextBlock } from "sanity";

export interface SanityAuthor {
  name: string;
  slug?: string;
  image?: string; // URL string from projection
  bio?: string;
  email?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface SanityCategory {
  _id: string;
  title: string;
  slug: string | { current: string }; // Allow both string and object
  description?: string;
  color?: string;
  count?: number;
  parent?: string;
}

export interface SanityComment {
  _id: string;
  _createdAt: string;
  wordpressId?: number;
  comment: string; // Content field is named 'comment' in query
  name: string;    // Author name
  email?: string;  // Author email
  parentCommentId?: number; // Legacy WP parent ID
  parentRef?: string; // Sanity parent reference
}

export interface SanityPost {
  _id: string;
  title: string;
  slug: string | { current: string }; // Allow both string and object
  publishedAt: string;
  excerpt?: string;
  body: PortableTextBlock[] | any;
  wordCount?: number;
  mainImage?: string; // URL string from projection
  author?: SanityAuthor;
  categories?: Array<{
    title: string;
    slug: string | { current: string };
    color?: string;
  }>;
  featured?: boolean;
  comments?: SanityComment[];
  bookTitle?: string;
  bookAuthor?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    ogImage?: string;
    noIndex?: boolean;
    canonicalUrl?: string;
  };
}

export interface SanityPage {
  _id: string;
  title: string;
  slug: string | { current: string }; // Allow both string and object
  excerpt?: string;
  content?: PortableTextBlock[] | any;
  mainImage?: string;
}
