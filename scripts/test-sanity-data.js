// Test script to check if Sanity posts have body content
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: '2024-01-01',
});

async function testSanityData() {
    console.log('🔍 Testing Sanity data...\n');

    // Test 1: Get all posts
    const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc) [0...5] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "hasBody": defined(body),
    "bodyLength": length(body),
    "bodyPreview": body[0..2]
  }`);

    console.log(`📊 Found ${posts.length} posts\n`);

    posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Has Body: ${post.hasBody}`);
        console.log(`   Body Length: ${post.bodyLength || 0} blocks`);
        if (post.bodyPreview && post.bodyPreview.length > 0) {
            console.log(`   First Block Type: ${post.bodyPreview[0]._type}`);
            if (post.bodyPreview[0].children) {
                const text = post.bodyPreview[0].children.map(c => c.text).join('').substring(0, 50);
                console.log(`   Preview: ${text}...`);
            }
        }
        console.log('');
    });

    // Test 2: Get a specific post with full body
    if (posts.length > 0) {
        const firstSlug = posts[0].slug;
        console.log(`\n🔍 Fetching full post: ${firstSlug}\n`);

        const fullPost = await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      body,
      "mainImage": mainImage.asset->url,
      "author": author->{name, "slug": slug.current, "image": image.asset->url},
      "categories": categories[]->{title, "slug": slug.current}
    }`, { slug: firstSlug });

        console.log('Full Post Data:');
        console.log(JSON.stringify(fullPost, null, 2));
    }
}

testSanityData().catch(console.error);
