import { cache } from 'react';
import { Category, Post, PageInfo } from '../types';
import {
  CATEGORIES_QUERY,
  CATEGORIES_WITH_COUNT_QUERY,
  POSTS_BY_CATEGORY_QUERY
} from '../../sanity/lib/queries';
import { client } from '../../sanity/lib/client';
import { mapSanityCategoryToCategory, mapSanityPostToPost } from '../sanity/mapper';

type CategoryPaginationParams = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
};

export const CategoryRepository = {
  getAll: async () => {
    try {
      const categories = await client.fetch(CATEGORIES_QUERY);
      return categories.map(mapSanityCategoryToCategory);
    } catch (error) {
      console.error("Error fetching all categories:", error);
      return [];
    }
  },

  getPostsByCategory: cache(async (
    slug: string,
    params: CategoryPaginationParams = { first: 10 }
  ): Promise<Category | null> => {
    try {
      // Re-using a combined query logic here or fetching in parallel
      const [posts, categoryInfo] = await Promise.all([
        client.fetch(POSTS_BY_CATEGORY_QUERY, { slug }),
        client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug })
      ]);
  
      if (!categoryInfo) return null;
  
      const category = mapSanityCategoryToCategory(categoryInfo);
      const allNodes = posts
        .map(mapSanityPostToPost)
        .filter((post: Post | null): post is Post => post !== null);

      let startIndex = 0;
      let endIndex = allNodes.length;

      if (params.after) {
        const afterIndex = allNodes.findIndex((post: Post) => post.id === params.after);
        if (afterIndex >= 0) {
          startIndex = afterIndex + 1;
        }
      }

      if (params.before) {
        const beforeIndex = allNodes.findIndex((post: Post) => post.id === params.before);
        if (beforeIndex >= 0) {
          endIndex = beforeIndex;
        }
      }

      const windowedNodes = allNodes.slice(startIndex, endIndex);
      const paginatedNodes =
        typeof params.first === 'number'
          ? windowedNodes.slice(0, params.first)
          : typeof params.last === 'number'
            ? windowedNodes.slice(Math.max(0, windowedNodes.length - params.last))
            : windowedNodes;

      category.posts = {
        nodes: paginatedNodes,
        pageInfo: {
          hasNextPage: endIndex < allNodes.length || (
            typeof params.first === 'number' && windowedNodes.length > paginatedNodes.length
          ),
          hasPreviousPage: startIndex > 0 || (
            typeof params.last === 'number' && windowedNodes.length > paginatedNodes.length
          ),
          startCursor: paginatedNodes[0]?.id ?? null,
          endCursor: paginatedNodes[paginatedNodes.length - 1]?.id ?? null,
        }
      };
  
      return category;
    } catch (error) {
      console.error(`Error fetching category ${slug}:`, error);
      return null;
    }
  }),

  // Legacy Book/Genre functions - mapped to Categories in Sanity for now?
  // Existing WP setup had 'genres' as categories under 'buku'.
  // We'll need to adapt this logic if migration preserved hierarchy.
  getAllGenres: cache(async (): Promise<Category[]> => {
    try {
      // Fetch all categories with post counts
      const categories = await client.fetch(CATEGORIES_WITH_COUNT_QUERY);
  
      // 1. Try to filter by parent == 'buku'
      const bookSubcategories = categories.filter((cat: { parent?: string }) => cat.parent === 'buku');
  
      if (bookSubcategories.length > 0) {
        return bookSubcategories.map(mapSanityCategoryToCategory);
      }
  
      // 2. Fallback: Filter out 'buku' category itself and non-book categories (Manual Exclusion)
      const excludedCategories = ['buku', 'uncategorized', 'blog', 'desain', 'teknologi', 'coding', 'meet-jati'];
      return categories
        .filter((cat: { slug: string }) => !excludedCategories.includes(cat.slug.toLowerCase()))
        .map(mapSanityCategoryToCategory);
    } catch (error) {
      console.error("Error fetching genres:", error);
      return [];
    }
  }),

  getGenreBySlug: cache(async (slug: string): Promise<Category | null> => {
    return CategoryRepository.getPostsByCategory(slug);
  }),

  getAllBookReviews: cache(async (
    params: CategoryPaginationParams = { first: 10 }
  ): Promise<{ nodes: Post[], pageInfo: PageInfo }> => {
    try {
      const posts = await client.fetch(POSTS_BY_CATEGORY_QUERY, { slug: 'buku' });
      const allNodes = posts
        .map(mapSanityPostToPost)
        .filter((post: Post | null): post is Post => post !== null);

      let nodes = allNodes;
      if (typeof params.first === 'number') {
        nodes = allNodes.slice(0, params.first);
      } else if (typeof params.last === 'number') {
        nodes = allNodes.slice(Math.max(0, allNodes.length - params.last));
      }

      return {
        nodes,
        pageInfo: {
          hasNextPage: typeof params.first === 'number' && allNodes.length > nodes.length,
          hasPreviousPage: typeof params.last === 'number' && allNodes.length > nodes.length,
          startCursor: nodes[0]?.id ?? null,
          endCursor: nodes[nodes.length - 1]?.id ?? null,
        }
      };
    } catch (error) {
      console.error("Error fetching book reviews:", error);
      return { nodes: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } };
    }
  }),
};
