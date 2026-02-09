import { PortableTextBlock } from '@portabletext/types';
import { slugify } from '@/lib/utils'; // Assuming slugify exists or I implement simple one

export interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function extractTocFromPortableText(blocks: any[]): TocItem[] {
    if (!Array.isArray(blocks)) return [];

    const toc: TocItem[] = [];

    blocks.forEach((block) => {
        if (block._type === 'block' && block.style && block.style.startsWith('h')) {
            const level = parseInt(block.style.replace('h', ''));
            // Only capture h2 and h3 typically, or logic from processContent
            if (level >= 2 && level <= 4) {
                const text = block.children?.map((child: any) => child.text).join('') || '';
                const id = slugify(text); // We need to ensure IDs match what PortableText renders!
                // PortableText renderer needs to assign these IDs to headers too.
                toc.push({ id, text, level });
            }
        }
    });

    return toc;
}
