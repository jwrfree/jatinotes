import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Nama kategori (contoh: Teknologi, Buku, Blog)',
            validation: (Rule) => Rule.required().min(2).max(50),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'URL-friendly version dari title',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Deskripsi singkat kategori (opsional)',
            rows: 2,
        }),
        defineField({
            name: 'color',
            title: 'Color',
            type: 'string',
            description: 'Warna untuk badge kategori (hex code, contoh: #3B82F6)',
            validation: (Rule) => Rule.regex(/^#[0-9A-F]{6}$/i, {
                name: 'hex color',
                invert: false,
            }).warning('Format harus hex color (contoh: #3B82F6)'),
        }),
        defineField({
            name: 'parent',
            title: 'Parent Category',
            type: 'reference',
            to: [{ type: 'category' }],
            description: 'Kategori induk (opsional). Contoh: "Fiksi" parent-nya "Buku".',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            description: 'description',
            color: 'color',
        },
        prepare(selection) {
            const { title, description, color } = selection
            return {
                title,
                subtitle: description || 'No description',
                media: color ? undefined : undefined,
            }
        },
    },
})

