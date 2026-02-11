import { Post, Category } from "@/lib/types";

// Extended types for new Sanity fields
export interface SanityPost {
    _id: string;
    title: string;
    slug: { current: string } | string;
    publishedAt: string;
    excerpt?: string;
    body: any;
    wordCount?: number;
    mainImage?: string;
    author?: {
        name: string;
        image?: string;
        bio?: string;
        email?: string;
        social?: {
            twitter?: string;
            linkedin?: string;
            github?: string;
            website?: string;
        };
    };
    categories?: Array<{
        title: string;
        slug: { current: string } | string;
        color?: string;
    }>;
    featured?: boolean;
    comments?: any[];
    bookTitle?: string;
    bookAuthor?: string;
}

export interface SanityCategory {
    _id: string;
    title: string;
    slug: { current: string } | string;
    description?: string;
    color?: string;
    count?: number;
    parent?: string;
}

export function mapSanityPostToPost(sanityPost: any): Post {
    if (!sanityPost) return sanityPost;

    return {
        id: sanityPost._id,
        databaseId: 0, // Mock ID or hash from _id
        title: sanityPost.title,
        slug: sanityPost.slug?.current || sanityPost.slug,
        date: sanityPost.publishedAt,
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
            nodes: sanityPost.categories.map((c: any) => ({
                name: c.title,
                slug: c.slug?.current || c.slug
            }))
        } : { nodes: [] },
        commentCount: sanityPost.comments?.length || 0,
        comments: sanityPost.comments ? {
            nodes: (() => {
                // 1. Build Map: WordPress ID -> Sanity ID
                const wpIdMap: Record<number, string> = {};
                sanityPost.comments.forEach((c: any) => {
                    if (c.wordpressId) {
                        wpIdMap[c.wordpressId] = c._id;
                    }
                });

                // 2. Map Comments and Resolve Parent IDs
                return sanityPost.comments.map((c: any) => {
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
        bookAuthor: sanityPost.bookAuthor
    };
}

export function mapSanityCategoryToCategory(sanityCategory: SanityCategory): Category {
    if (!sanityCategory) return sanityCategory;
    return {
        id: sanityCategory._id || '',
        name: sanityCategory.title,
        slug: typeof sanityCategory.slug === 'string' ? sanityCategory.slug : sanityCategory.slug?.current || '',
        parent: sanityCategory.parent,
        description: sanityCategory.description,
        color: sanityCategory.color,
        count: sanityCategory.count || 0,
        posts: { nodes: [] } // Handled separately
    }
}

export function mapSanityPageToPage(sanityPage: any): any {
    if (!sanityPage) return sanityPage;
    return {
        id: sanityPage._id,
        title: sanityPage.title,
        slug: sanityPage.slug?.current || sanityPage.slug,
        excerpt: sanityPage.excerpt || "",
        content: sanityPage.content,
        featuredImage: sanityPage.mainImage ? {
            node: {
                sourceUrl: sanityPage.mainImage,
                mediaDetails: { width: 1200, height: 630 }
            }
        } : null,
        commentCount: sanityPage.comments?.length || 0,
        comments: sanityPage.comments ? {
            nodes: (() => {
                const wpIdMap: Record<number, string> = {};
                sanityPage.comments.forEach((c: any) => {
                    if (c.wordpressId) {
                        wpIdMap[c.wordpressId] = c._id;
                    }
                });

                return sanityPage.comments.map((c: any) => {
                    let resolvedParentId = c.parentRef || (c.parentCommentId ? String(c.parentCommentId) : null);

                    if (!c.parentRef && c.parentCommentId && wpIdMap[c.parentCommentId]) {
                        resolvedParentId = wpIdMap[c.parentCommentId];
                    } else if (!c.parentRef && c.parentCommentId && !wpIdMap[c.parentCommentId]) {
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
        } : { nodes: [] }
    };
}
