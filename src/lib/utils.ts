export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Calculate reading time from content or Post object
 * Supports HTML strings, PortableText arrays, and Post objects with wordCount
 */
export function calculateReadingTime(input: string | any[] | { wordCount?: number | null; content?: string | any[] | null }): number {
  const wordsPerMinute = 200;
  let characterCount = 0;

  // If input is a Post object with wordCount, use it directly
  if (typeof input === 'object' && input !== null && !Array.isArray(input) && 'wordCount' in input) {
    characterCount = input.wordCount || 0;
    if (characterCount > 0) {
      // Estimate words from characters (average 5 characters per word)
      const estimatedWords = characterCount / 5;
      const minutes = estimatedWords / wordsPerMinute;
      return Math.max(1, Math.ceil(minutes));
    }
    // Fallback to content if wordCount is 0
    if (input.content) {
      return calculateReadingTime(input.content);
    }
  }

  // Original logic for string or array
  let text = '';
  if (typeof input === 'string') {
    // HTML string - strip tags
    text = input.replace(/<[^>]*>?/gm, '');
  } else if (Array.isArray(input)) {
    // PortableText array - extract text from blocks
    text = extractTextFromPortableText(input);
  }

  const numberOfWords = text.split(/\s+/g).filter(word => word.length > 0).length;
  const minutes = numberOfWords / wordsPerMinute;
  return Math.max(1, Math.ceil(minutes)); // Minimum 1 minute
}

/**
 * Extract plain text from PortableText blocks
 */
function extractTextFromPortableText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks
    .map(block => {
      if (block._type === 'block' && block.children) {
        return block.children
          .map((child: any) => child.text || '')
          .join(' ');
      }
      return '';
    })
    .filter(text => text.length > 0)
    .join(' ');
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Baru saja';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  }

  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} minggu yang lalu`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} tahun yang lalu`;
}

export function formatDateIndonesian(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

import { Comment } from './types';

export function organizeComments(nodes: Comment[]): Comment[] {
  const commentMap = new Map<number, Comment>();
  const roots: Comment[] = [];

  nodes.forEach(node => {
    if (node.databaseId) {
      commentMap.set(node.databaseId, { ...node, children: [] });
    }
  });

  nodes.forEach(node => {
    if (node.databaseId) {
      const comment = commentMap.get(node.databaseId);
      if (comment && node.parentDatabaseId && commentMap.has(node.parentDatabaseId)) {
        commentMap.get(node.parentDatabaseId)!.children?.push(comment);
      } else if (comment) {
        roots.push(comment);
      }
    }
  });

  return roots;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
}
