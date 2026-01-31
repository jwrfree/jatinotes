import { NextResponse } from 'next/server';
import { searchPosts } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const posts = await searchPosts(query);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}
