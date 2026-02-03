import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/api';
import { Post } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jatinotes.com';

  // Fetch all posts
  const { nodes: posts } = await getAllPosts();
  
  const postUrls = (posts || []).map((post: Post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticPages = [
    '',
    '/blog',
    '/meet-jati',
    '/buku',
    '/teknologi',
    '/desain',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [
    ...staticPages,
    ...postUrls,
  ];
}
