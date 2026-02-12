import { Post, Category, Page } from "@/lib/types";
import { SanityPost, SanityCategory, SanityComment, SanityPage } from "./types";

export function mapSanityPostToPost(sanityPost: SanityPost | null | undefined): Post | null {
    if (!sanityPost || !sanityPost._id) return null;

    return {
        id: sanityPost._id,
        databaseId: 0,
        title: sanityPost.title || "Untitled Post",
        slug: typeof sanityPost.slug === 'string' ? sanityPost.slug : sanityPost.slug?.current || `post-${sanityPost._id}`,
        date: sanityPost.publishedAt || new Date().toISOString(),
        excerpt: sanityPost.excerpt || "",
        content: sanityPost.body, // This will now be PortableTextBlock[], type definition needs update or loose typing
        wordCount: sanityPost.wordCount || 0, // Character count from Sanity
        featuredImage: sanityPost.mainImage ? {
            node: {
                sourceUrl: sanityPost.mainImage,
                mediaDetails: { width: 800, height: 600 } // Mock dims
            }
        } : null,
        author: sanityPost.author ? {
            node: {
                name: sanityPost.author.name,
                avatar: sanityPost.author.image ? { url: sanityPost.author.image } : null
            }
        } : null,
        categories: sanityPost.categories ? {
            nodes: sanityPost.categories.map((c) => ({
                name: c.title,
                slug: typeof c.slug === 'string' ? c.slug : c.slug?.current || ""
            }))
        } : { nodes: [] },
        commentCount: sanityPost.comments?.length || 0,
        comments: sanityPost.comments ? {
            nodes: (() => {
                // 1. Build Map: WordPress ID -> Sanity ID
                const wpIdMap: Record<number, string> = {};
                sanityPost.comments.forEach((c) => {
                    if (c.wordpressId) {
                        wpIdMap[c.wordpressId] = c._id;
                    }
                });

                // 2. Map Comments and Resolve Parent IDs
                return sanityPost.comments.map((c) => {
                    // Default parent ID: Native Sanity Ref or Legacy WP ID
                    let resolvedParentId = c.parentRef || (c.parentCommentId ? String(c.parentCommentId) : null);

                    // If we rely on legacy WP ID and it exists in our map, resolve it to Sanity UUID
                    if (!c.parentRef && c.parentCommentId && wpIdMap[c.parentCommentId]) {
                        resolvedParentId = wpIdMap[c.parentCommentId];
                    } else if (!c.parentRef && c.parentCommentId && !wpIdMap[c.parentCommentId]) {
                        // Orphan legacy comment -> top level
                        resolvedParentId = null;
                    }

                    return {
                        id: c._id,
                        date: c._createdAt,
                        content: c.comment,
                        author: {
                            node: {
                                name: c.name,
                                avatar: {
                                    url: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random`
                                }
                            }
                        },
                        parentId: resolvedParentId,
                        children: []
                    };
                });
            })()
        } : { nodes: [] },
        tags: { nodes: [] },
        bookTitle: sanityPost.bookTitle,
        bookAuthor: sanityPost.bookAuthor,
        seo: sanityPost.seo ? {
            metaTitle: sanityPost.seo.metaTitle,
            metaDescription: sanityPost.seo.metaDescription,
            focusKeyword: sanityPost.seo.focusKeyword,
            ogImage: sanityPost.seo.ogImage,
            noIndex: sanityPost.seo.noIndex,
            canonicalUrl: sanityPost.seo.canonicalUrl
        } : null
    };
}

export function mapSanityCategoryToCategory(sanityCategory: SanityCategory): Category {
    if (!sanityCategory) return sanityCategory;
    return {
        id: sanityCategory._id || '',
        name: sanityCategory.title || 'Uncategorized',
        slug: typeof sanityCategory.slug === 'string' ? sanityCategory.slug : sanityCategory.slug?.current || '',
        parent: sanityCategory.parent,
        description: sanityCategory.description,
        color: sanityCategory.color,
        count: sanityCategory.count || 0,
        posts: { nodes: [] } // Handled separately
    }
}

export function mapSanityPageToPage(sanityPage: SanityPage | null | undefined): Page | null {
    if (!sanityPage) return null;
    return {
        id: sanityPage._id,
        title: sanityPage.title,
        slug: typeof sanityPage.slug === 'string' ? sanityPage.slug : (sanityPage.slug as any)?.current || "",
        excerpt: sanityPage.excerpt || "",
        content: sanityPage.content,
        featuredImage: sanityPage.mainImage ? {
            node: {
                sourceUrl: sanityPage.mainImage,
                mediaDetails: { width: 1200, height: 630 }
            }
        } : null
    };
}
