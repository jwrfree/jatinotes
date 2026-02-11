import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'comment',
    title: 'Comment',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
        }),
        defineField({
            name: 'comment',
            title: 'Comment',
            type: 'text',
        }),
        defineField({
            name: 'post',
            title: 'Post / Page',
            type: 'reference',
            to: [{ type: 'post' }, { type: 'page' }],
        }),
        defineField({
            name: 'approved',
            title: 'Approved',
            type: 'boolean',
            description: "Comments won't show on the site without approval",
            initialValue: false
        }),
        defineField({
            name: 'wordpressId',
            title: 'WordPress ID',
            type: 'number',
            hidden: true // Hanya untuk keperluan migrasi
        }),
        defineField({
            name: 'parent',
            title: 'Parent Comment',
            type: 'reference',
            to: [{ type: 'comment' }],
            description: 'Reference to parent comment for threading (Sanity Native)',
        }),
        defineField({
            name: 'parentCommentId',
            title: 'Parent Comment ID (Legacy WP)',
            type: 'number',
            hidden: true,
        })
    ],
    preview: {
        select: {
            name: 'name',
            comment: 'comment',
            post: 'post.title',
        },
        prepare({ name, comment, post }) {
            return {
                title: `${name} on ${post}`,
                subtitle: comment,
            }
        },
    },
})
