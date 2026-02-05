import { cache } from 'react';
import { z } from 'zod';
import { CategorySchema, PageInfoSchema, PostSchema, Category, Post, PageInfo } from '../types';
import { 
  CATEGORY_POSTS_QUERY, 
  ALL_CATEGORIES_QUERY, 
  ALL_GENRES_QUERY, 
  GENRE_BY_SLUG_QUERY 
} from '../queries';
import { fetchAPI } from '../api';

export const CategoryRepository = {
  getAll: async () => {
    const data = await fetchAPI(ALL_CATEGORIES_QUERY);
    return data?.categories?.nodes;
  },

  getPostsByCategory: cache(async (slug: string, params: { first?: number, after?: string, last?: number, before?: string } = { first: 10 }): Promise<Category | null> => {
    const data = await fetchAPI(
      CATEGORY_POSTS_QUERY,
      {
        variables: {
          id: slug,
          idType: 'SLUG',
          ...params
        },
      }
    );
    
    if (!data?.category) return null;
    const parsed = CategorySchema.safeParse(data.category);
    if (!parsed.success) {
      console.error(`❌ Category validation error for slug ${slug}:`, parsed.error);
      return data.category as Category;
    }
    return parsed.data;
  }),

  getAllGenres: cache(async (): Promise<Category[]> => {
    const data = await fetchAPI(ALL_GENRES_QUERY, { variables: { parentId: 'buku' } });
    const nodes = data?.category?.children?.nodes || [];
    const parsed = z.array(CategorySchema).safeParse(nodes);
    if (!parsed.success) {
      console.error("❌ Genres validation error:", parsed.error);
      return nodes as Category[];
    }
    return parsed.data;
  }),

  getGenreBySlug: cache(async (slug: string, params: { first?: number, after?: string } = { first: 20 }): Promise<Category | null> => {
    const data = await fetchAPI(GENRE_BY_SLUG_QUERY, {
      variables: {
        id: slug,
        idType: 'SLUG',
        ...params
      }
    });

    if (!data?.category) return null;
    const parsed = CategorySchema.safeParse(data.category);
    if (!parsed.success) {
      console.error(`❌ Genre validation error for slug ${slug}:`, parsed.error);
      return data.category as Category;
    }
    return parsed.data;
  }),

  getAllBookReviews: cache(async (params: { first?: number, after?: string } = { first: 50 }): Promise<{ nodes: Post[], pageInfo: PageInfo }> => {
    const data = await fetchAPI(CATEGORY_POSTS_QUERY, {
      variables: {
        id: 'buku',
        idType: 'SLUG',
        ...params
      }
    });

    const nodes = data?.category?.posts?.nodes || [];
    const pageInfo = data?.category?.posts?.pageInfo || { hasNextPage: false, hasPreviousPage: false };

    const parsedNodes = z.array(PostSchema).safeParse(nodes);
    const parsedPageInfo = PageInfoSchema.safeParse(pageInfo);

    if (!parsedNodes.success) {
      console.error("❌ Book reviews validation error:", parsedNodes.error);
    }

    return {
      nodes: parsedNodes.success ? parsedNodes.data : nodes as Post[],
      pageInfo: parsedPageInfo.success ? parsedPageInfo.data : pageInfo as PageInfo
    };
  }),
};
