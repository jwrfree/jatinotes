import { describe, it, expect } from 'vitest';
import { processContent, addIdsToHeadings } from './sanitize';

// Mock stripHtml if it's not exported or just replicate its behavior for tests if it's simple
// Looking at the imports in other files, stripHtml is imported from './utils'.
// But wait, the previous view_file of sanitize.ts showed processContent and addIdsToHeadings.
// It did NOT show stripHtml being exported from sanitize.ts.
// Let me double check sanitize.ts content from step 33.
// sanitize.ts exports: sanitize, processContent, addIdsToHeadings.
// It does NOT export stripHtml. stripHtml is likely in utils.ts.
//
// So I should test processContent and addIdsToHeadings from sanitize.ts.
// I can also check utils.ts if I want to test stripHtml there, but user asked for "critical functions".
// processContent is critical for TOC.

describe('processContent', () => {
    it('should return empty content and TOC for empty input', () => {
        const result = processContent('');
        expect(result).toEqual({ content: '', toc: [] });
    });

    it('should ignore H3 tags and not add them to TOC', () => {
        const input = '<h3>Subtitle</h3>';
        const result = processContent(input);
        expect(result.content).toBe(input);
        expect(result.toc).toEqual([]);
        expect(result.content).not.toContain('id=');
    });

    it('should process H2 tags: add ID and add to TOC', () => {
        const input = '<h2>My Title</h2>';
        const result = processContent(input);

        // Expect ID to be added
        expect(result.content).toContain('id="my-title"');
        expect(result.content).toContain('My Title');

        // Expect TOC entry
        expect(result.toc).toHaveLength(1);
        expect(result.toc[0]).toEqual({
            id: 'my-title',
            text: 'My Title',
            level: 2
        });
    });

    it('should preserve existing IDs on H2 tags', () => {
        const input = '<h2 id="custom-id">My Title</h2>';
        const result = processContent(input);

        expect(result.content).toBe(input);
        expect(result.toc).toHaveLength(1);
        expect(result.toc[0]).toEqual({
            id: 'custom-id',
            text: 'My Title',
            level: 2
        });
    });

    it('should handle multiple H2 tags', () => {
        const input = `
      <h2>First Section</h2>
      <p>Content</p>
      <h2>Second Section</h2>
    `;
        const result = processContent(input);

        expect(result.toc).toHaveLength(2);
        expect(result.toc[0].id).toBe('first-section');
        expect(result.toc[1].id).toBe('second-section');

        expect(result.content).toContain('id="first-section"');
        expect(result.content).toContain('id="second-section"');
    });

    it('should remove HTML tags from TOC text', () => {
        const input = '<h2>Title with <em>Emphasis</em></h2>';
        const result = processContent(input);

        expect(result.toc[0].text).toBe('Title with Emphasis');
        expect(result.content).toContain('id="title-with-emphasis"');
    });

    it('should handle non-ASCII characters in ID generation consistently', () => {
        // Basic slugification test
        const input = '<h2>Café & Restaurant</h2>';
        // Expectation depends on implementation.
        // Logic: .toLowerCase().replace(/<[^>]*>?/gm, '').trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
        // "café & restaurant" -> "café-restaurant" (because & is removed by [^\w-])
        // Wait, \w includes [a-zA-Z0-9_]. é is not in \w usually in JS regex unless unicode flag?
        // Let's see what happens.

        const result = processContent(input);

        // If it removes non-word chars, é might be removed if environment considers it non-word.
        // But typically in modern JS engines, \w might not match é.
        // If it is removed: "caf-restaurant"
        // If it is kept: "café-restaurant"
        // Let's just check that an ID is generated and matches what's used in content

        expect(result.toc.length).toBe(1);
        const id = result.toc[0].id;
        expect(result.content).toContain(`id="${id}"`);
    });
});

describe('addIdsToHeadings', () => {
    it('should return string only (legacy support)', () => {
        const input = '<h2>Legacy</h2>';
        const result = addIdsToHeadings(input);
        expect(typeof result).toBe('string');
        expect(result).toContain('id="legacy"');
    });
});
