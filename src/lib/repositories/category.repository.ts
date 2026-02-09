import { cache } from 'react';
import { Category, Post, PageInfo } from '../types';
import {
  CATEGORIES_QUERY,
  POSTS_BY_CATEGORY_QUERY,
  AUTHORS_QUERY,
  POSTS_BY_AUTHOR_QUERY
} from '../../sanity/lib/queries';
import { client } from '../../sanity/lib/client';
import { mapSanityCategoryToCategory, mapSanityPostToPost } from '../sanity/mapper';

export const CategoryRepository = {
  getAll: async () => {
    const categories = await client.fetch(CATEGORIES_QUERY);
    return categories.map(mapSanityCategoryToCategory);
  },

  getPostsByCategory: cache(async (slug: string, params: { first?: number } = { first: 10 }): Promise<Category | null> => {
    // We need to fetch the category details AND its posts
    // Sanity query in queries.ts only fetches posts? Let's check. 
    // POSTS_BY_CATEGORY_QUERY fetches posts.
    // We need the category info too.

    // Re-using a combined query logic here or fetching in parallel
    const [posts, categoryInfo] = await Promise.all([
      client.fetch(POSTS_BY_CATEGORY_QUERY, { slug }),
      client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug })
    ]);

    if (!categoryInfo) return null;

    const category = mapSanityCategoryToCategory(categoryInfo);
    category.posts = {
      nodes: posts.map(mapSanityPostToPost),
      pageInfo: { hasNextPage: false, hasPreviousPage: false } // Mock
    };

    return category;
  }),

  // Legacy Book/Genre functions - mapped to Categories in Sanity for now?
  // Existing WP setup had 'genres' as categories under 'buku'.
  // We'll need to adapt this logic if migration preserved hierarchy.
  getAllGenres: cache(async (): Promise<Category[]> => {
    // Return empty or fetch all categories for now
    return [];
  }),

  getGenreBySlug: cache(async (slug: string): Promise<Category | null> => {
    return CategoryRepository.getPostsByCategory(slug);
  }),

  getAllBookReviews: cache(async (params: { first?: number } = {}): Promise<{ nodes: Post[], pageInfo: PageInfo }> => {
    // Fetch posts in 'buku' category or similar
    const posts = await client.fetch(POSTS_BY_CATEGORY_QUERY, { slug: 'buku' });
    return {
      nodes: posts.map(mapSanityPostToPost),
      pageInfo: { hasNextPage: false, hasPreviousPage: false }
    };
  }),
};
