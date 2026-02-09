import { Post, Category } from "@/lib/types";

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
                    // Start with raw parent ID (WP ID for migrated comments)
                    let resolvedParentId = c.parentCommentId ? String(c.parentCommentId) : null;

                    // If it's a numeric WP ID, try to find the matching Sanity ID
                    if (resolvedParentId && c.parentCommentId && wpIdMap[c.parentCommentId]) {
                        resolvedParentId = wpIdMap[c.parentCommentId];
                    } else if (resolvedParentId && c.parentCommentId && !wpIdMap[c.parentCommentId]) {
                        // Parent not found in this query (maybe not approved yet?), make it top-level to avoid orphan
                        // Or keep it if your organizeComments handles missing parents
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
        tags: { nodes: [] }
    };
}

export function mapSanityCategoryToCategory(sanityCategory: any): Category {
    if (!sanityCategory) return sanityCategory;
    return {
        id: sanityCategory._id || '',
        name: sanityCategory.title,
        slug: sanityCategory.slug?.current || sanityCategory.slug,
        description: sanityCategory.description,
        count: 0,
        posts: { nodes: [] } // Handled separately
    }
}
