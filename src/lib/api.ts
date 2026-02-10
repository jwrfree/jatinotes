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

