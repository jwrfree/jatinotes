import { cache } from 'react';
import { PostSchema, CategorySchema, Post, Category } from './types';
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
  { variables, revalidate = 60 }: { variables?: any, revalidate?: number | false } = {}
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
  } catch (error: any) {
    console.error('--- Fetch API Error Details ---');
    console.error('URL:', API_URL);
    if (error instanceof Error) {
      console.error('Error Message:', error.message);
      if (error.cause) {
        console.error('Error Cause:', error.cause);
      }
      console.error('--------------------------------');
      
      const errorMessage = error.message;
      const errorCause = error.cause as any;
      
      if (errorMessage.includes('SSL') || (errorCause && errorCause.message && errorCause.message.includes('SSL'))) {
        throw new Error(`SSL Handshake Failed: Gagal terhubung ke ${API_URL} karena masalah SSL. Pastikan server WordPress Anda mengizinkan koneksi TLS yang kompatibel.`);
      }

      throw new Error(`Failed to fetch API from ${API_URL}. ${errorMessage}`);
    }

    console.error('--------------------------------');
    throw new Error(`Failed to fetch API from ${API_URL}. Unknown error occurred.`);
  }
}

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const data = await fetchAPI(ALL_POSTS_QUERY);
  
  const nodes = data?.posts?.nodes || [];
  return z.array(PostSchema).parse(nodes);
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
  const data = await fetchAPI(
    CREATE_COMMENT_MUTATION,
    {
      variables: {
        input: {
          content: input.content,
          author: input.author,
          authorEmail: input.authorEmail,
          commentOn: input.postId,
        },
      },
      revalidate: false, // Don't cache mutations
    }
  );
  return data?.createComment;
}

export const getPageBySlug = cache(async (slug: string): Promise<any> => { // Adjust type as needed or use a Schema
  const data = await fetchAPI(
    PAGE_BY_SLUG_QUERY,
    {
      variables: {
        id: slug,
        idType: 'URI',
      },
    }
  );
  return data?.page;
});

export const getPostsByCategory = cache(async (slug: string): Promise<Category | null> => {
  const data = await fetchAPI(
    CATEGORY_POSTS_QUERY,
    {
      variables: {
        id: slug,
        idType: 'SLUG',
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
