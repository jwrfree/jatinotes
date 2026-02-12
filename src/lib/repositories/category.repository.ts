import { cache } from 'react';
import { Category, Post, PageInfo } from '../types';
import {
  CATEGORIES_QUERY,
  CATEGORIES_WITH_COUNT_QUERY,
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
      nodes: posts.map(mapSanityPostToPost).filter((post: Post | null): post is Post => post !== null),
      pageInfo: { hasNextPage: false, hasPreviousPage: false } // Mock
    };

    return category;
  }),

  // Legacy Book/Genre functions - mapped to Categories in Sanity for now?
  // Existing WP setup had 'genres' as categories under 'buku'.
  // We'll need to adapt this logic if migration preserved hierarchy.
  getAllGenres: cache(async (): Promise<Category[]> => {
    // Fetch all categories with post counts
    const categories = await client.fetch(CATEGORIES_WITH_COUNT_QUERY);

    // 1. Try to filter by parent == 'buku'
    const bookSubcategories = categories.filter((cat: any) => cat.parent === 'buku');

    if (bookSubcategories.length > 0) {
      return bookSubcategories.map(mapSanityCategoryToCategory);
    }

    // 2. Fallback: Filter out 'buku' category itself and non-book categories (Manual Exclusion)
    const excludedCategories = ['buku', 'uncategorized', 'blog', 'desain', 'teknologi', 'coding', 'meet-jati'];
    return categories
      .filter((cat: any) => !excludedCategories.includes(cat.slug.toLowerCase()))
      .map(mapSanityCategoryToCategory);
  }),

  getGenreBySlug: cache(async (slug: string): Promise<Category | null> => {
    return CategoryRepository.getPostsByCategory(slug);
  }),

  getAllBookReviews: cache(async (params: { first?: number } = {}): Promise<{ nodes: Post[], pageInfo: PageInfo }> => {
    // Fetch posts in 'buku' category or similar
    const posts = await client.fetch(POSTS_BY_CATEGORY_QUERY, { slug: 'buku' });
    return {
      nodes: posts.map(mapSanityPostToPost).filter((post: Post | null): post is Post => post !== null),
      pageInfo: { hasNextPage: false, hasPreviousPage: false }
    };
  }),
};
