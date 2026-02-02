import { cache } from 'react';
import { PostSchema, CategorySchema, Post, Category, PageInfo, PageInfoSchema } from './types';
import { z } from 'zod';
import {
  ALL_POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  CREATE_COMMENT_MUTATION,
  PAGE_BY_SLUG_QUERY,
  CATEGORY_POSTS_QUERY,
  ALL_CATEGORIES_QUERY,
  SEARCH_POSTS_QUERY
} from './queries';

const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(
  query: string, 
  { variables, revalidate = 60 }: { variables?: Record<string, unknown>, revalidate?: number | false } = {}
) {
  const headers = { 'Content-Type': 'application/json' };

  if (!API_URL) {
    throw new Error('WORDPRESS_API_URL is not defined in .env.local');
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
      next: revalidate !== false ? { revalidate } : undefined,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Response Error (${res.status}):`, errorText);
      throw new Error(`API returned status ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
      const message = json.errors[0]?.message || 'Failed to fetch API: GraphQL Errors';
      throw new Error(message);
    }
    return json.data;
  } catch (error: unknown) {
    console.error('--- Fetch API Error Details ---');
    console.error('URL:', API_URL);
    if (error instanceof Error) {
      console.error('Error Message:', error.message);
      if (error.cause) {
        console.error('Error Cause:', error.cause);
      }
      console.error('--------------------------------');
      
      const errorMessage = error.message;
      const errorCause = error.cause as Error | undefined;
      
      if (errorMessage.includes('SSL') || (errorCause && errorCause.message && errorCause.message.includes('SSL'))) {
        throw new Error(`SSL Handshake Failed: Gagal terhubung ke ${API_URL} karena masalah SSL. Pastikan server WordPress Anda mengizinkan koneksi TLS yang kompatibel.`);
      }

      throw new Error(`Failed to fetch API from ${API_URL}. ${errorMessage}`);
    }

    console.error('--------------------------------');
    throw new Error(`Failed to fetch API from ${API_URL}. Unknown error occurred.`);
  }
}

export const getAllPosts = cache(async (params: { first?: number, after?: string, last?: number, before?: string } = { first: 10 }): Promise<{ nodes: Post[], pageInfo: PageInfo }> => {
  const data = await fetchAPI(ALL_POSTS_QUERY, { variables: params });
  
  const nodes = data?.posts?.nodes || [];
  const pageInfo = data?.posts?.pageInfo || { hasNextPage: false, hasPreviousPage: false };
  
  return {
    nodes: z.array(PostSchema).parse(nodes),
    pageInfo: PageInfoSchema.parse(pageInfo)
  };
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
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
});

export async function createComment(input: {
  content: string;
  author: string;
  authorEmail: string;
  postId: number;
}) {
  const data = await fetchAPI(CREATE_COMMENT_MUTATION, {
    variables: { 
      input: {
        author: input.author,
        authorEmail: input.authorEmail,
        content: input.content,
        commentOn: input.postId
      }
    },
    revalidate: false
  });
  return data?.createComment;
}

export const getPageBySlug = cache(async (slug: string) => {
  const data = await fetchAPI(PAGE_BY_SLUG_QUERY, {
    variables: {
      id: slug,
      idType: 'URI',
    },
  });
  return data?.page;
});

export const getPostsByCategory = cache(async (slug: string, params: { first?: number, after?: string, last?: number, before?: string } = { first: 10 }): Promise<Category | null> => {
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
  return CategorySchema.parse(data.category);
});

export async function getAllCategories() {
  const data = await fetchAPI(ALL_CATEGORIES_QUERY);
  return data?.categories?.nodes;
}

export async function searchPosts(searchTerm: string): Promise<Post[]> {
  const data = await fetchAPI(
    SEARCH_POSTS_QUERY,
    {
      variables: { search: searchTerm },
      revalidate: 3600, // Search results can be cached longer
    }
  );
  
  const nodes = data?.posts?.nodes || [];
  return z.array(PostSchema).parse(nodes);
}
