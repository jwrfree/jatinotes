/**
 * Set Default Author for All Posts
 * 
 * This script sets a default author for all posts that don't have one.
 * Useful for single-author blogs where you want to bulk-assign yourself as author.
 * 
 * Usage:
 * 1. Update YOUR_AUTHOR_ID below with your actual author document ID
 * 2. Run: node scripts/set-default-author.mjs
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Create Sanity client
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_WRITE_TOKEN, // You need a write token
    apiVersion: '2024-01-01',
    useCdn: false,
})

// ⚠️ IMPORTANT: Replace this with your actual author document ID
// To find your author ID:
// 1. Open Sanity Studio (http://localhost:3333)
// 2. Go to Author section
// 3. Open your author document
// 4. Look at the URL: http://localhost:3333/structure/author;YOUR_ID_HERE
// 5. Copy the ID after the semicolon
const YOUR_AUTHOR_ID = 'REPLACE_WITH_YOUR_AUTHOR_ID'

async function setDefaultAuthor() {
    console.log('🔍 Checking for posts without author...\n')

    try {
        // First, verify the author exists
        const author = await client.fetch(`*[_type == "author" && _id == $authorId][0]`, {
            authorId: YOUR_AUTHOR_ID,
        })

        if (!author) {
            console.error('❌ Error: Author not found!')
            console.error(`   Author ID: ${YOUR_AUTHOR_ID}`)
            console.error('\n💡 Tips:')
            console.error('   1. Create an author document first in Sanity Studio')
            console.error('   2. Get the author ID from the URL when editing the author')
            console.error('   3. Update YOUR_AUTHOR_ID in this script')
            process.exit(1)
        }

        console.log(`✅ Found author: ${author.name}`)
        console.log(`   ID: ${YOUR_AUTHOR_ID}\n`)

        // Get all posts without author
        const postsWithoutAuthor = await client.fetch(`
      *[_type == "post" && !defined(author)] {
        _id,
        title,
        slug
      }
    `)

        if (postsWithoutAuthor.length === 0) {
            console.log('✅ All posts already have an author assigned!')
            console.log('   Nothing to update.')
            return
        }

        console.log(`📝 Found ${postsWithoutAuthor.length} post(s) without author:\n`)
        postsWithoutAuthor.forEach((post, index) => {
            console.log(`   ${index + 1}. ${post.title}`)
        })

        console.log(`\n🔄 Updating posts with author: ${author.name}...\n`)

        // Update each post
        let successCount = 0
        let errorCount = 0

        for (const post of postsWithoutAuthor) {
            try {
                await client
                    .patch(post._id)
                    .set({
                        author: {
                            _type: 'reference',
                            _ref: YOUR_AUTHOR_ID,
                        },
                    })
                    .commit()

                console.log(`   ✅ Updated: ${post.title}`)
                successCount++
            } catch (error) {
                console.error(`   ❌ Failed: ${post.title}`)
                console.error(`      Error: ${error.message}`)
                errorCount++
            }
        }

        console.log('\n' + '='.repeat(60))
        console.log('📊 Summary:')
        console.log(`   ✅ Successfully updated: ${successCount} post(s)`)
        if (errorCount > 0) {
            console.log(`   ❌ Failed: ${errorCount} post(s)`)
        }
        console.log('='.repeat(60))
        console.log('\n✨ Done!')

    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}

// Check if author ID is set
if (YOUR_AUTHOR_ID === 'REPLACE_WITH_YOUR_AUTHOR_ID') {
    console.error('❌ Error: Please set YOUR_AUTHOR_ID in the script first!')
    console.error('\n📝 Steps:')
    console.error('   1. Open Sanity Studio: http://localhost:3333')
    console.error('   2. Go to Author section')
    console.error('   3. Open your author document')
    console.error('   4. Copy the ID from the URL')
    console.error('   5. Update YOUR_AUTHOR_ID in this script')
    console.error('   6. Run this script again')
    process.exit(1)
}

// Check if write token is set
if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌ Error: SANITY_API_WRITE_TOKEN not found in .env.local')
    console.error('\n📝 Steps to create a write token:')
    console.error('   1. Go to https://sanity.io/manage')
    console.error('   2. Select your project')
    console.error('   3. Go to API → Tokens')
    console.error('   4. Create a new token with "Editor" or "Administrator" permissions')
    console.error('   5. Add to .env.local: SANITY_API_WRITE_TOKEN=your_token_here')
    process.exit(1)
}

// Run the script
setDefaultAuthor()
