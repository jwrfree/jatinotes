import DOMPurify from 'isomorphic-dompurify';

export function sanitize(content: string): string {
  return DOMPurify.sanitize(content);
}

/**
 * Adds IDs to headings in HTML content for Table of Contents links
 */
export function addIdsToHeadings(content: string): string {
  if (!content) return "";
  
  // Remove WordPress/Spectra TOC if present (as requested to hide TOC feature)
  const processedContent = content.replace(/<div class="uagb-toc__wrap">[\s\S]*?<\/div>\s*<\/div>/gi, "");

  // This is a simple server-side regex approach to add IDs to headings
  // It finds <h2 ...>Text</h2> and replaces it with <h2 id="text" ...>Text</h2>
  return processedContent.replace(/<(h[2-3])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attributes, text) => {
    // Skip if ID already exists
    if (attributes.includes('id=')) return match;
    
    const id = text
      .toLowerCase()
      .replace(/<[^>]*>?/gm, '') // Remove any nested tags
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
      
    return `<${tag}${attributes} id="${id}">${text}</${tag}>`;
  });
}
