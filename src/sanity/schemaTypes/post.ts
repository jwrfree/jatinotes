import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'post',
    title: 'Post',
    type: 'document',
    groups: [
        {
            name: 'content',
            title: 'Content',
            default: true,
        },
        {
            name: 'meta',
            title: 'Metadata',
        },
        {
            name: 'seo',
            title: 'SEO',
        },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Judul artikel yang menarik dan deskriptif',
            validation: (Rule) => Rule.required().min(10).max(100).warning('Judul sebaiknya 10-100 karakter'),
            group: 'content',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'URL-friendly version dari judul. Klik "Generate" untuk auto-generate dari judul',
            options: {
                source: 'title',
                maxLength: 96,
                slugify: (input: string) =>
                    input
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w\-]+/g, '')
                        .replace(/\-\-+/g, '-')
                        .replace(/^-+/, '')
                        .replace(/-+$/, ''),
            },
            validation: (Rule) => Rule.required(),
            group: 'content',
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            description: 'Ringkasan singkat artikel (ditampilkan di card & meta description)',
            rows: 3,
            validation: (Rule) => Rule.required().min(50).max(160).warning('Excerpt ideal: 50-160 karakter untuk SEO'),
            group: 'content',
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'blockContent',
            description: 'Konten utama artikel',
            validation: (Rule) => Rule.required(),
            group: 'content',
        }),
        defineField({
            name: 'mainImage',
            title: 'Featured Image',
            type: 'image',
            description: 'Gambar utama artikel (recommended: 1200x630px)',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alt Text',
                    description: 'Deskripsi gambar untuk SEO & accessibility',
                    validation: (Rule) => Rule.required().warning('Alt text penting untuk SEO'),
                },
            ],
            validation: (Rule) => Rule.required(),
            group: 'content',
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: { type: 'author' },
            description: 'Penulis artikel (auto-set ke Anda)',
            validation: (Rule) => Rule.required(),
            // Hide this field since you're the only author
            // To set default: Create one author document first, then this will auto-populate
            hidden: true,
            group: 'meta',
        }),
        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'category' } }],
            description: 'Kategori artikel (pilih 1-3 kategori yang relevan)',
            validation: (Rule) => Rule.required().min(1).max(3).warning('Pilih 1-3 kategori'),
            group: 'meta',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published Date',
            type: 'datetime',
            description: 'Tanggal publikasi artikel',
            initialValue: () => new Date().toISOString(),
            validation: (Rule) => Rule.required(),
            group: 'meta',
        }),
        defineField({
            name: 'featured',
            title: 'Featured Post',
            type: 'boolean',
            description: 'Tandai sebagai artikel unggulan (akan ditampilkan di homepage)',
            initialValue: false,
            group: 'meta',
        }),
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'seo',
            description: 'Pengaturan SEO kustom (opsional - akan auto-generate dari title & excerpt jika kosong)',
            group: 'seo',
        }),
    ],

    preview: {
        select: {
            title: 'title',
            author: 'author.name',
            media: 'mainImage',
            publishedAt: 'publishedAt',
            categories: 'categories',
        },
        prepare(selection) {
            const { author, publishedAt, categories } = selection
            const categoryCount = categories?.length || 0
            const date = publishedAt ? new Date(publishedAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }) : 'Draft'

            return {
                ...selection,
                subtitle: `${author || 'No author'} • ${date} • ${categoryCount} kategori`,
            }
        },
    },

    orderings: [
        {
            title: 'Published Date, Newest',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
        {
            title: 'Published Date, Oldest',
            name: 'publishedAtAsc',
            by: [{ field: 'publishedAt', direction: 'asc' }],
        },
        {
            title: 'Title, A-Z',
            name: 'titleAsc',
            by: [{ field: 'title', direction: 'asc' }],
        },
    ],
})
