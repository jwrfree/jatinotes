// Debug script to test actual post fetching
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: '2024-01-01',
});

// Simulate the exact query used in the app
const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": coalesce(slug.current, slug),
  excerpt,
  publishedAt,
  "mainImage": mainImage.asset->url,
  "author": author->{name, "slug": slug.current, "image": image.asset->url},
  "categories": categories[]->{title, "slug": slug.current},
  body,
  "related": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc, _createdAt desc) [0...3] {
    _id,
    title,
    "slug": coalesce(slug.current, slug),
    excerpt,
    publishedAt,
    "mainImage": mainImage.asset->url,
    "author": author->{name, "slug": slug.current, "image": image.asset->url},
    "categories": categories[]->{title, "slug": slug.current}
  }
}`;

async function testPostFetch() {
    const testSlug = 'kenapa-buku-quiet-bikin-aku-merasa-dimengerti';

    console.log(`🔍 Fetching post with slug: ${testSlug}\n`);

    const post = await client.fetch(POST_BY_SLUG_QUERY, { slug: testSlug });

    if (!post) {
        console.error('❌ Post not found!');
        return;
    }

    console.log('✅ Post fetched successfully!\n');
    console.log('📝 Post Details:');
    console.log(`   Title: ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Published: ${post.publishedAt}`);
    console.log(`   Has Body: ${!!post.body}`);
    console.log(`   Body Type: ${Array.isArray(post.body) ? 'Array (PortableText)' : typeof post.body}`);
    console.log(`   Body Length: ${post.body?.length || 0} blocks`);

    if (post.body && post.body.length > 0) {
        console.log('\n📄 First 3 blocks:');
        post.body.slice(0, 3).forEach((block, i) => {
            console.log(`\n   Block ${i + 1}:`);
            console.log(`   - Type: ${block._type}`);
            console.log(`   - Style: ${block.style || 'N/A'}`);
            if (block.children) {
                const text = block.children.map(c => c.text).join('').substring(0, 80);
                console.log(`   - Text: ${text}...`);
            }
        });
    }

    // Test mapper
    console.log('\n\n🔄 Testing Mapper...');

    const mappedPost = {
        id: post._id,
        databaseId: 0,
        title: post.title,
        slug: post.slug,
        date: post.publishedAt,
        excerpt: post.excerpt || "",
        content: post.body, // This should be PortableText array
        featuredImage: post.mainImage ? {
            node: {
                sourceUrl: post.mainImage,
                mediaDetails: { width: 800, height: 600 }
            }
        } : null,
        author: post.author ? {
            node: {
                name: post.author.name,
                avatar: post.author.image ? { url: post.author.image } : null
            }
        } : null,
        categories: post.categories ? {
            nodes: post.categories.map((c) => ({
                name: c.title,
                slug: c.slug
            }))
        } : { nodes: [] },
        commentCount: 0,
        comments: { nodes: [] },
        tags: { nodes: [] }
    };

    console.log('\n✅ Mapped Post:');
    console.log(`   Content Type: ${Array.isArray(mappedPost.content) ? 'Array (PortableText)' : typeof mappedPost.content}`);
    console.log(`   Content Length: ${mappedPost.content?.length || 0}`);
    console.log(`   Is Portable Text: ${Array.isArray(mappedPost.content)}`);

    // Simulate page logic
    const isPortableText = Array.isArray(mappedPost.content);
    console.log('\n🎨 Rendering Logic:');
    console.log(`   Will use: ${isPortableText ? 'PortableText Component' : 'Prose Component (HTML)'}`);

    if (isPortableText && mappedPost.content.length > 0) {
        console.log('\n✅ SUCCESS: Content will be rendered with PortableText component');
    } else {
        console.log('\n⚠️  WARNING: Content might not render properly');
    }
}

testPostFetch().catch(console.error);
