import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'author',
    title: 'Author',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            description: 'Nama lengkap penulis',
            validation: (Rule) => Rule.required().min(2).max(100),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'URL-friendly version dari nama',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Profile Image',
            type: 'image',
            description: 'Foto profil penulis (recommended: 400x400px)',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alt Text',
                    description: 'Deskripsi gambar untuk accessibility',
                },
            ],
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'text',
            description: 'Bio singkat penulis (1-2 kalimat)',
            rows: 3,
            validation: (Rule) => Rule.max(300).warning('Bio sebaiknya tidak lebih dari 300 karakter'),
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            description: 'Email penulis (opsional)',
            validation: (Rule) => Rule.email().warning('Format email tidak valid'),
        }),
        defineField({
            name: 'social',
            title: 'Social Media',
            type: 'object',
            description: 'Link social media penulis (opsional)',
            fields: [
                {
                    name: 'twitter',
                    title: 'Twitter/X',
                    type: 'url',
                    description: 'URL lengkap (contoh: https://twitter.com/username)',
                },
                {
                    name: 'linkedin',
                    title: 'LinkedIn',
                    type: 'url',
                    description: 'URL lengkap (contoh: https://linkedin.com/in/username)',
                },
                {
                    name: 'github',
                    title: 'GitHub',
                    type: 'url',
                    description: 'URL lengkap (contoh: https://github.com/username)',
                },
                {
                    name: 'website',
                    title: 'Website',
                    type: 'url',
                    description: 'Personal website atau portfolio',
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image',
            bio: 'bio',
        },
        prepare(selection) {
            const { title, bio } = selection
            return {
                ...selection,
                subtitle: bio ? bio.substring(0, 60) + (bio.length > 60 ? '...' : '') : 'No bio',
            }
        },
    },
})

