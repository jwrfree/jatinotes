import { cache } from 'react';
import { z } from 'zod';
import { PostSchema, PageInfoSchema, Post, PageInfo } from '../types';
import { ALL_POSTS_QUERY, POST_BY_SLUG_QUERY, SEARCH_POSTS_QUERY } from '../queries';
import { fetchAPI } from '../api';

export const PostRepository = {
  getAll: cache(async (params: { first?: number, after?: string, last?: number, before?: string } = { first: 10 }): Promise<{ nodes: Post[], pageInfo: PageInfo }> => {
    const data = await fetchAPI(ALL_POSTS_QUERY, { variables: params });
    
    const nodes = data?.posts?.nodes || [];
    const pageInfo = data?.posts?.pageInfo || { hasNextPage: false, hasPreviousPage: false };
    
    return {
      nodes: z.array(PostSchema).parse(nodes),
      pageInfo: PageInfoSchema.parse(pageInfo)
    };
  }),

  getBySlug: cache(async (slug: string): Promise<Post | null> => {
    const data = await fetchAPI(
      POST_BY_SLUG_QUERY,
      {
        variables: {
          id: slug,
          idType: 'SLUG',
        },
      }
    );
    
    if (!data?.post) return null;
    return PostSchema.parse(data.post);
  }),

  search: async (searchTerm: string): Promise<Post[]> => {
    const data = await fetchAPI(
      SEARCH_POSTS_QUERY,
      {
        variables: { search: searchTerm },
        revalidate: 3600,
      }
    );
    
    const nodes = data?.posts?.nodes || [];
    return z.array(PostSchema).parse(nodes);
  },
};
