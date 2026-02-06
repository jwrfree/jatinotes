import { Post } from './types';
import { getAllPosts, getPostsByCategory, getAllCategories } from './api';

export async function getHomeData() {
  try {
    // Fetch data in parallel but robustly (soft fail)
    const [postsResult, , booksResult, techResult, blogResult] = await Promise.allSettled([
      getAllPosts({ first: 10 }),
      getAllCategories(),
      getPostsByCategory("buku", { first: 10 }),
      getPostsByCategory("teknologi", { first: 10 }),
      getPostsByCategory("blog", { first: 20 })
    ]);

    // Helper to extract value or default
    const getValue = <T>(result: PromiseSettledResult<T>, defaultValue: T): T =>
      result.status === 'fulfilled' ? result.value : defaultValue;

    const postsData = getValue(postsResult, { nodes: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } });
    const booksData = getValue(booksResult, null);
    const techData = getValue(techResult, null);
    const blogData = getValue(blogResult, null);

    // Log failure reasons for debugging
    if (postsResult.status === 'rejected') console.error("❌ Failed to fetch posts:", postsResult.reason);
    if (booksResult.status === 'rejected') console.error("❌ Failed to fetch books:", booksResult.reason);
    if (techResult.status === 'rejected') console.error("❌ Failed to fetch tech:", techResult.reason);
    if (blogResult.status === 'rejected') console.error("❌ Failed to fetch blog:", blogResult.reason);

    const rawPosts = postsData?.nodes || [];
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
