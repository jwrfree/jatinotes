/**
 * Script untuk migrasi komentar langsung dari WordPress GraphQL ke Sanity
 * 
 * Menggunakan WORDPRESS_API_URL dari .env.local
 */

import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load env
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env.local')
dotenv.config({ path: envPath })

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL
const SANITY_API_WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN

if (!WORDPRESS_API_URL || !SANITY_API_WRITE_TOKEN) {
    console.error('Error: Missing environment variables.')
    console.error('Pastikan WORDPRESS_API_URL dan SANITY_API_WRITE_TOKEN ada di .env.local')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: SANITY_API_WRITE_TOKEN,
    useCdn: false,
})

async function fetchGraphQL(query, variables = {}) {
    // Gunakan native fetch (Node 18+)
    const res = await fetch(WORDPRESS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    })

    if (!res.ok) {
        const txt = await res.text()
        throw new Error(`WordPress API Error (${res.status}): ${txt.substring(0, 100)}`)
    }

    const json = await res.json()
    if (json.errors) {
        throw new Error(JSON.stringify(json.errors))
    }
    return json.data
}

async function migrateComments() {
    console.log(`Connecting to WordPress: ${WORDPRESS_API_URL}`)
    console.log('Fetching comments...')

    let hasNextPage = true
    let after = null
    let totalImported = 0

    while (hasNextPage) {
        let data;
        try {
            data = await fetchGraphQL(`
        query GetAllComments($after: String) {
          comments(first: 100, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              databaseId
              content(format: RENDERED)
              date
              author {
                node {
                  name
                  email
                  url
                }
              }
              commentOn {
                ... on Post {
                  slug
                }
              }
              parentDatabaseId
            }
          }
        }
      `, { after })
        } catch (err) {
            console.error('GraphQL Query Failed:', err.message)
            process.exit(1)
        }

        const comments = data.comments.nodes
        hasNextPage = data.comments.pageInfo.hasNextPage
        after = data.comments.pageInfo.endCursor

        console.log(`Processing batch of ${comments.length} comments...`)

        for (const wpComment of comments) {
            if (!wpComment.commentOn || !wpComment.commentOn.slug) {
                continue // Skip if no post attached
            }

            const postSlug = wpComment.commentOn.slug
            const wpId = wpComment.databaseId

            // 2. Cari Post Sanity by Slug
            const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug: postSlug })

            if (!post) {
                console.warn(`Post "${postSlug}" not found in Sanity. Skipping comment ${wpId}.`)
                continue
            }

            // 3. Cek apakah komentar sudah ada (idempotency key: wordpressId)
            const existing = await client.fetch(`*[_type == "comment" && wordpressId == $id][0]`, { id: wpId })

            if (existing) {
                // console.log(`Comment ${wpId} already exists. Skipping.`)
                continue
            }

            // 4. Create Comment
            const doc = {
                _type: 'comment',
                name: wpComment.author?.node?.name || 'Anonymous',
                email: wpComment.author?.node?.email || 'no-email@example.com',
                comment: wpComment.content, // HTML content from WP
                post: {
                    _type: 'reference',
                    _ref: post._id
                },
                approved: true,
                wordpressId: wpId,
                parentCommentId: wpComment.parentDatabaseId || 0,
                _createdAt: wpComment.date ? new Date(wpComment.date).toISOString() : new Date().toISOString()
            }

            try {
                await client.create(doc)
                console.log(`✅ Imported comment ${wpId} on ${postSlug}`)
                totalImported++
            } catch (err) {
                console.error(`❌ Failed import ${wpId}: ${err.message}`)
            }
        }
    }

    console.log(`\n--- Selesai ---\nTotal Komentar Diimpor: ${totalImported}`)
}

migrateComments()
