export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  // Strip HTML tags
  const text = content.replace(/<[^>]*>?/gm, '');
  const numberOfWords = text.split(/\s/g).length;
  const minutes = numberOfWords / wordsPerMinute;
  return Math.ceil(minutes);
}
