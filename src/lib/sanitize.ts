import sanitizeHtml from 'sanitize-html';

/**
 * Robust HTML sanitization using sanitize-html
 * Safe for server-side rendering in Vercel (Node.js environment)
 * Replaces isomorphic-dompurify to avoid jsdom/ESM issues
 */
export function sanitize(content: string): string {
  if (!content) return "";
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'iframe' ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      'a': [ 'href', 'name', 'target', 'rel', 'className' ],
      'img': [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'className' ],
      'iframe': [ 'src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen' ],
      '*': ['className', 'style', 'id'] // Allow basic styling attributes
    },
    allowedSchemes: [ 'http', 'https', 'mailto', 'tel' ]
  });
}

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

/**
 * Adds IDs to headings and extracts TOC structure
 */
export function processContent(content: string): { content: string; toc: TocItem[] } {
  if (!content) return { content: "", toc: [] };

  // Remove WordPress/Spectra TOC if present
  let processedContent = content.replace(/<div class="uagb-toc__wrap">[\s\S]*?<\/div>\s*<\/div>/gi, "");

  const toc: TocItem[] = [];

  processedContent = processedContent.replace(/<(h[2-3])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attributes, text) => {
    const level = parseInt(tag.charAt(1));

    // Only process H2 for TOC (User request)
    if (level !== 2) return match;

    // If ID already exists, extract it
    const existingIdMatch = attributes.match(/id=["']([^"']+)["']/);
    let id = existingIdMatch ? existingIdMatch[1] : "";

    if (!id) {
      id = text
        .toLowerCase()
        .replace(/<[^>]*>?/gm, '') // Remove nested tags
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
    }

    // Clean text for TOC display (remove HTML tags)
    const cleanText = text.replace(/<[^>]*>?/gm, '').trim();

    toc.push({ id, text: cleanText, level });

    if (existingIdMatch) return match; // Already has ID
    return `<${tag}${attributes} id="${id}">${text}</${tag}>`;
  });

  return { content: processedContent, toc };
}

/**
 * Legacy support for addIdsToHeadings (returns string only)
 */
export function addIdsToHeadings(content: string): string {
  return processContent(content).content;
}
