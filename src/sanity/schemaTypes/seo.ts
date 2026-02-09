import { defineType, defineField } from 'sanity';

/**
 * SEO Object Type - Reusable SEO fields for any document
 * Similar to Yoast SEO plugin
 */
export default defineType({
    name: 'seo',
    title: 'SEO',
    type: 'object',
    fields: [
        defineField({
            name: 'metaTitle',
            title: 'Meta Title',
            type: 'string',
            description: 'SEO title (recommended: 50-60 characters). Leave empty to use post title.',
            validation: (Rule) => Rule.max(60).warning('Meta title should be 50-60 characters for optimal SEO'),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description',
            type: 'text',
            rows: 3,
            description: 'SEO description (recommended: 150-160 characters). Leave empty to use excerpt.',
            validation: (Rule) => Rule.max(160).warning('Meta description should be 150-160 characters for optimal SEO'),
        }),
        defineField({
            name: 'focusKeyword',
            title: 'Focus Keyword',
            type: 'string',
            description: 'Main keyword for this content (like Yoast SEO focus keyword)',
        }),
        defineField({
            name: 'ogImage',
            title: 'Social Share Image',
            type: 'image',
            description: 'Custom image for social media sharing (Facebook, Twitter, etc). Leave empty to use featured image.',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                },
            ],
        }),
        defineField({
            name: 'noIndex',
            title: 'Hide from Search Engines',
            type: 'boolean',
            description: 'Prevent search engines from indexing this page',
            initialValue: false,
        }),
        defineField({
            name: 'canonicalUrl',
            title: 'Canonical URL',
            type: 'url',
            description: 'Custom canonical URL (optional, for duplicate content)',
        }),
    ],
    preview: {
        select: {
            title: 'metaTitle',
            description: 'metaDescription',
        },
        prepare({ title, description }) {
            return {
                title: title || 'SEO Settings',
                subtitle: description ? `${description.substring(0, 50)}...` : 'No meta description set',
            };
        },
    },
});
