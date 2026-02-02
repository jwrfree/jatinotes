import { Post, Category } from './types';
import { getAllPosts, getPostsByCategory, getAllCategories } from './api';

export async function getHomeData() {
  try {
    const [postsData, , booksData, techData, blogData] = await Promise.all([
      getAllPosts(),
      getAllCategories(),
      getPostsByCategory("buku"),
      getPostsByCategory("teknologi"),
      getPostsByCategory("blog")
    ]);
    
    const rawPosts = postsData || [];
    const bookCategory = booksData;
    const techCategory = techData;
    const blogCategory = blogData;

    // Filter posts to avoid redundancy
    const featuredPost = rawPosts[0];
    const techPosts = techCategory?.posts?.nodes || [];
    const bookPosts = bookCategory?.posts?.nodes || [];
    const blogPosts = blogCategory?.posts?.nodes || [];
    
    const techPostIdsShown = new Set(techPosts.map((p: Post) => p.id));
    const bookPostIdsShown = new Set(bookPosts.map((p: Post) => p.id));
    
    // Blog section posts: Filter from blogCategory specifically
    let posts = blogPosts.filter((p: Post) => 
      p.id !== featuredPost?.id && 
      !techPostIdsShown.has(p.id) && 
      !bookPostIdsShown.has(p.id)
    ).slice(0, 6);

    // Keep the first post as featured
    if (featuredPost) {
      posts = [featuredPost, ...posts];
    }

    return {
      posts,
      blogCategory,
      techCategory,
      bookCategory
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return {
      posts: [],
      blogCategory: null,
      techCategory: null,
      bookCategory: null
    };
  }
}
