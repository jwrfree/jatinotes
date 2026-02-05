import { cache } from 'react';
import { env } from './env';
import { PostSchema, CategorySchema, Post, Category, PageInfo, PageInfoSchema } from './types';
import { z } from 'zod';
import {
  ALL_POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  CREATE_COMMENT_MUTATION,
  PAGE_BY_SLUG_QUERY,
  CATEGORY_POSTS_QUERY,
  ALL_CATEGORIES_QUERY,
  SEARCH_POSTS_QUERY,
  ALL_GENRES_QUERY,
  GENRE_BY_SLUG_QUERY
} from './queries';

const API_URL = env.WORDPRESS_API_URL;

class APIError extends Error {
  constructor(message: string, public status?: number, public errors?: any[]) {
    super(message);
    this.name = 'APIError';
  }
}

export async function fetchAPI(
  query: string, 
  { variables, revalidate = 60 }: { variables?: Record<string, unknown>, revalidate?: number | false } = {}
) {
  const headers = { 'Content-Type': 'application/json' };

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
      throw new APIError(`API returned status ${res.status}`, res.status);
    }

    const json = await res.json();
    if (json.errors) {
      const message = json.errors[0]?.message || 'Failed to fetch API: GraphQL Errors';
      throw new APIError(message, 200, json.errors);
    }
    return json.data;
  } catch (error: unknown) {
    if (error instanceof APIError) throw error;
    
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (message.includes('SSL')) {
      throw new Error(`SSL Handshake Failed: Gagal terhubung ke ${API_URL} karena masalah SSL.`);
    }

    throw new Error(`Failed to fetch API from ${API_URL}. ${message}`);
  }
}

// Re-export repositories for centralized access
export * from './repositories/post.repository';
export * from './repositories/page.repository';
export * from './repositories/category.repository';
export * from './repositories/comment.repository';

// Backward compatibility exports (pointing to repositories)
import { PostRepository } from './repositories/post.repository';
import { PageRepository } from './repositories/page.repository';
import { CategoryRepository } from './repositories/category.repository';
import { CommentRepository } from './repositories/comment.repository';

export const getAllPosts = PostRepository.getAll;
export const getPostBySlug = PostRepository.getBySlug;
export const searchPosts = PostRepository.search;

export const getPageBySlug = PageRepository.getBySlug;

export const getAllCategories = CategoryRepository.getAll;
export const getPostsByCategory = CategoryRepository.getPostsByCategory;
export const getAllGenres = CategoryRepository.getAllGenres;
export const getGenreBySlug = CategoryRepository.getGenreBySlug;
export const getAllBookReviews = CategoryRepository.getAllBookReviews;

export const createComment = CommentRepository.create;

