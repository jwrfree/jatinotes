import { defineQuery } from "next-sanity";

// --- Post Fields ---
const postFields = `
  _id,
  title,
  "slug": coalesce(slug.current, slug),
  excerpt,
  publishedAt,
  "mainImage": mainImage.asset->url,
  "author": author->{name, "slug": slug.current, "image": image.asset->url},
  "categories": categories[]->{title, "slug": slug.current},
  "wordCount": length(pt::text(body)),
  bookTitle,
  bookAuthor
`;

// --- Queries ---

export const POSTS_QUERY = defineQuery(`*[_type == "post" && (defined(slug.current) || defined(slug))] | order(publishedAt desc, _createdAt desc) {
  ${postFields}
}`);

export const POSTS_QUERY_LIMITED = defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc, _createdAt desc) [0...$limit] {
  ${postFields}
}`);

export const POST_BY_SLUG_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  ${postFields},
  body,
  seo {
    metaTitle,
    metaDescription,
    focusKeyword,
    "ogImage": ogImage.asset->url,
    noIndex,
    canonicalUrl
  },
  "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt asc) {
    _id,
    _createdAt,
    name,
    email,
    comment,
    parentCommentId,
    "parentRef": parent._ref,
    wordpressId
  },
  "related": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc, _createdAt desc) [0...3] {
    ${postFields}
  }
}`);

// --- Category Queries ---

export const CATEGORIES_QUERY = defineQuery(`*[_type == "category"] {
  title,
  "slug": coalesce(slug.current, slug),
  description
}`);

export const CATEGORIES_WITH_COUNT_QUERY = defineQuery(`*[_type == "category" && count(*[_type == "post" && references(^._id)]) > 0] | order(title asc) {
  title,
  "slug": coalesce(slug.current, slug),
  "parent": parent->slug.current,
  "count": count(*[_type == "post" && references(^._id)])
}`);

export const POSTS_BY_CATEGORY_QUERY = defineQuery(`*[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc, _createdAt desc) {
  ${postFields}
}`);

// --- Author Queries ---

export const AUTHORS_QUERY = defineQuery(`*[_type == "author"] {
  name,
  "slug": slug.current,
  "image": image.asset->url,
  bio
}`);

export const POSTS_BY_AUTHOR_QUERY = defineQuery(`*[_type == "post" && author->slug.current == $slug] | order(publishedAt desc, _createdAt desc) {
  ${postFields}
}`);

export const PAGE_BY_SLUG_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  content,
  "mainImage": mainImage.asset->url
}`);
