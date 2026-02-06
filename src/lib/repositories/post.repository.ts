import { cache } from 'react';
import { z } from 'zod';
import { PostSchema, PageInfoSchema, Post, PageInfo } from '../types';
import { ALL_POSTS_QUERY, POST_BY_SLUG_QUERY, SEARCH_POSTS_QUERY } from '../queries';
import { fetchAPI } from '../fetcher';

export const PostRepository = {
  getAll: cache(async (params: { first?: number, after?: string, last?: number, before?: string } = { first: 10 }): Promise<{ nodes: Post[], pageInfo: PageInfo }> => {
    const data = await fetchAPI(ALL_POSTS_QUERY, { variables: params });

    const nodes = data?.posts?.nodes || [];
    const pageInfo = data?.posts?.pageInfo || { hasNextPage: false, hasPreviousPage: false };

    const parsedNodes = z.array(PostSchema).safeParse(nodes);
    const parsedPageInfo = PageInfoSchema.safeParse(pageInfo);

    if (!parsedNodes.success) {
      console.error("❌ Post validation error:", parsedNodes.error);
    }

    return {
      nodes: parsedNodes.success ? parsedNodes.data : nodes as Post[],
      pageInfo: parsedPageInfo.success ? parsedPageInfo.data : pageInfo as PageInfo
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

    const parsed = PostSchema.safeParse(data.post);
    if (!parsed.success) {
      console.error(`❌ Post validation error for slug ${slug}:`, parsed.error);
      return data.post as Post;
    }

    return parsed.data;
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
    const parsed = z.array(PostSchema).safeParse(nodes);

    if (!parsed.success) {
      console.error("❌ Search results validation error:", parsed.error);
      return nodes as Post[];
    }

    return parsed.data;
  },
};
