import { defineArrayMember, defineType } from 'sanity'

export default defineType({
    name: 'blockContent',
    title: 'Block Content',
    type: 'array',
    of: [
        defineArrayMember({
            title: 'Block',
            type: 'block',
            styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H1', value: 'h1' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
                { title: 'Lead', value: 'lead' },
            ],
            lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Number', value: 'number' },
            ],
            marks: {
                decorators: [
                    { title: 'Strong', value: 'strong' },
                    { title: 'Emphasis', value: 'em' },
                    { title: 'Code', value: 'code' },
                    { title: 'Underline', value: 'underline' },
                    { title: 'Strike', value: 'strike-through' },
                ],
                annotations: [
                    {
                        title: 'URL',
                        name: 'link',
                        type: 'object',
                        fields: [
                            {
                                title: 'URL',
                                name: 'href',
                                type: 'url',
                                validation: (Rule) => Rule.uri({
                                    scheme: ['http', 'https', 'mailto', 'tel']
                                })
                            },
                        ],
                    },
                ],
            },
        }),
        defineArrayMember({
            type: 'image',
            options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative text',
                },
                {
                    name: 'caption',
                    type: 'string',
                    title: 'Caption',
                }
            ]
        }),
        defineArrayMember({
            name: 'code',
            title: 'Code Block',
            type: 'object',
            fields: [
                {
                    name: 'language',
                    title: 'Language',
                    type: 'string',
                    initialValue: 'javascript',
                    options: {
                        list: [
                            { title: 'JavaScript', value: 'javascript' },
                            { title: 'TypeScript', value: 'typescript' },
                            { title: 'HTML', value: 'html' },
                            { title: 'CSS', value: 'css' },
                            { title: 'JSON', value: 'json' },
                            { title: 'Bash', value: 'bash' },
                            { title: 'SQL', value: 'sql' },
                        ]
                    }
                },
                {
                    name: 'code',
                    title: 'Code',
                    type: 'text',
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: 'filename',
                    title: 'Filename',
                    type: 'string',
                }
            ]
        }),
        defineArrayMember({
            name: 'callout',
            title: 'Callout',
            type: 'object',
            fields: [
                {
                    name: 'type',
                    title: 'Type',
                    type: 'string',
                    initialValue: 'info',
                    options: {
                        list: [
                            { title: 'Info', value: 'info' },
                            { title: 'Warning', value: 'warning' },
                            { title: 'Success', value: 'success' },
                            { title: 'Idea', value: 'idea' },
                        ]
                    }
                },
                {
                    name: 'text',
                    title: 'Text',
                    type: 'text',
                    validation: (Rule) => Rule.required(),
                }
            ]
        }),
    ],
})
