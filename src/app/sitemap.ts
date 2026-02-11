
import { MetadataRoute } from 'next';
import { getAllPosts, getAllCategories } from '@/lib/api';
import { Post, Category } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jatinotes.com';

  // Fetch posts and categories in parallel
  const [{ nodes: posts }, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories()
  ]);
  
  const postUrls = (posts || []).map((post: Post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Filter out categories that are already static pages or internal
  const excludedCategories = ['buku', 'uncategorized'];
  const categoryUrls = (categories || [])
    .filter((cat: Category) => !excludedCategories.includes(cat.slug))
    .map((category: Category) => ({
      url: `${baseUrl}/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  const staticPages = [
    '',
    '/blog',
    '/meet-jati',
    '/buku',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [
    ...staticPages,
    ...categoryUrls,
    ...postUrls,
  ];
}
