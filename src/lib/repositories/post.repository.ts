import { cache } from 'react';
import { Post, PageInfo } from '../types';
import { POSTS_QUERY, POSTS_QUERY_LIMITED, POST_BY_SLUG_QUERY } from '../../sanity/lib/queries';
import { client } from '../../sanity/lib/client';
import { mapSanityPostToPost } from '../sanity/mapper';

export const PostRepository = {
  /**
   * Retrieves a list of posts from Sanity.
   * Note: Pagination in Sanity is different (offset/limit).
   * For simplicity in this migration, we fetch latest posts based on limits.
   */
  getAll: cache(async (params: { first?: number, after?: string, last?: number, before?: string } = { first: 10 }): Promise<{ nodes: Post[], pageInfo: PageInfo }> => {
    try {
      // Sanity pagination logic is complex with cursors.
      // For now, we fetch a limited number of posts using 'first' param or default 10.
      const limit = params.first || 10;

      // If 'after' is present (cursor), we would need a more complex query.
      // Simplifying to basic limit for migration MVP.
      const posts = await client.fetch(POSTS_QUERY_LIMITED, { limit });

      const nodes = posts.map(mapSanityPostToPost).filter((post: Post | null): post is Post => post !== null);

      return {
        nodes,
        pageInfo: {
          hasNextPage: posts.length === limit, // Rough estimate
          hasPreviousPage: false,
          endCursor: nodes.length > 0 ? nodes[nodes.length - 1].id : null,
          startCursor: nodes.length > 0 ? nodes[0].id : null
        }
      };
    } catch (error) {
      console.error("Error fetching posts:", error);
      return { nodes: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } };
    }
  }),

  /**
   * Retrieves a single post by its slug.
   */
  getBySlug: cache(async (slug: string): Promise<Post | null> => {
    try {
      const post = await client.fetch(POST_BY_SLUG_QUERY, { slug });
      return mapSanityPostToPost(post);
    } catch (error) {
      console.error(`Error fetching post ${slug}:`, error);
      return null;
    }
  }),

  /**
   * Searches for posts.
   * Sanity GROQ search.
   */
  search: async (searchTerm: string): Promise<Post[]> => {
    try {
      // Basic search implementation
      const query = `*[_type == "post" && (title match $term || body[].children[].text match $term)] {
        _id, title, "slug": slug.current, publishedAt
      }`;
      const posts = await client.fetch(query, { term: `*${searchTerm}*` });
      return posts.map(mapSanityPostToPost).filter((post: Post | null): post is Post => post !== null);
    } catch (error) {
      console.error(`Error searching posts for ${searchTerm}:`, error);
      return [];
    }
  },
};
