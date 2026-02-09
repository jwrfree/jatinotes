// Test mapper functionality
import { mapSanityPostToPost } from '../src/lib/sanity/mapper.js';

const sampleSanityPost = {
    _id: 'post-718',
    title: 'Test Post',
    slug: { current: 'test-post' },
    publishedAt: '2025-01-01T00:00:00',
    excerpt: 'This is a test excerpt',
    body: [
        {
            _key: 'block1',
            _type: 'block',
            style: 'normal',
            markDefs: [],
            children: [
                {
                    _key: 'span1',
                    _type: 'span',
                    marks: [],
                    text: 'This is a test paragraph.'
                }
            ]
        },
        {
            _key: 'block2',
            _type: 'block',
            style: 'h2',
            markDefs: [],
            children: [
                {
                    _key: 'span2',
                    _type: 'span',
                    marks: [],
                    text: 'Test Heading'
                }
            ]
        }
    ],
    mainImage: {
        asset: {
            url: 'https://example.com/image.jpg'
        }
    },
    author: {
        name: 'Test Author',
        slug: { current: 'test-author' },
        image: {
            asset: {
                url: 'https://example.com/avatar.jpg'
            }
        }
    },
    categories: [
        {
            title: 'Test Category',
            slug: { current: 'test-category' }
        }
    ]
};

console.log('🧪 Testing mapper...\n');
console.log('Input (Sanity Post):');
console.log(JSON.stringify(sampleSanityPost, null, 2));

const mappedPost = mapSanityPostToPost(sampleSanityPost);

console.log('\n\n✅ Output (Mapped Post):');
console.log(JSON.stringify(mappedPost, null, 2));

console.log('\n\n📝 Content Type Check:');
console.log('Is content an array?', Array.isArray(mappedPost.content));
console.log('Content length:', mappedPost.content?.length);
console.log('First block type:', mappedPost.content?.[0]?._type);
