import { slugify } from '@/lib/utils';
import { PortableTextBlock } from 'sanity';

export interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function extractTocFromPortableText(blocks: PortableTextBlock[]): TocItem[] {
    if (!Array.isArray(blocks)) return [];

    const toc: TocItem[] = [];

    blocks.forEach((block) => {
        const style = typeof block.style === 'string' ? block.style : '';

        if (block._type === 'block' && style.startsWith('h')) {
            const level = parseInt(style.replace('h', ''));
            // Only capture h2 and h3 typically, or logic from processContent
            if (level >= 2 && level <= 4) {
                const children = Array.isArray(block.children) ? block.children : [];
                const text = children.map((child: { text?: string }) => child.text).join('') || '';
                const id = slugify(text); // We need to ensure IDs match what PortableText renders!
                // PortableText renderer needs to assign these IDs to headers too.
                toc.push({ id, text, level });
            }
        }
    });

    return toc;
}
