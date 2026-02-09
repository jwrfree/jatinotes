/**
 * Script untuk migrasi komentar dari WordPress GraphQL ke Sanity
 * Strategi: Fetch posts dari Sanity -> Query comments per post dari WP
 */

import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load env
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env default first
dotenv.config({ path: path.resolve(__dirname, '../.env') })
// Load .env.local override
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true })

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL
const SANITY_API_WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN

if (!WORDPRESS_API_URL || !SANITY_API_WRITE_TOKEN) {
  console.error('Error: Missing environment variables.')
  if (!WORDPRESS_API_URL) console.error('- WORDPRESS_API_URL tidak ditemukan.')
  if (!SANITY_API_WRITE_TOKEN) console.error('- SANITY_API_WRITE_TOKEN tidak ditemukan.')
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
  console.log('Fetching posts from Sanity to match slugs...')

  const posts = await client.fetch(`*[_type == "post" && defined(slug.current)]{ "slug": slug.current, _id }`)
  console.log(`Found ${posts.length} posts in Sanity. Checking comments for each...`)

  let totalImported = 0

  for (const post of posts) {
    const { slug, _id } = post
    // console.log(`Checking: ${slug}`)

    try {
      const data = await fetchGraphQL(`
        query GetPostComments($slug: ID!) {
          post(id: $slug, idType: SLUG) {
             databaseId
             comments(first: 100) {
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
                 parentDatabaseId
               }
             }
          }
        }
      `, { slug })

      if (!data.post) {
        // console.warn(`Post ${slug} not found in WordPress.`)
        continue
      }

      const comments = data.post.comments?.nodes || []
      if (comments.length === 0) continue

      console.log(`Found ${comments.length} comments for "${slug}". Importing...`)

      for (const wpComment of comments) {
        // Check existing
        const existing = await client.fetch(`*[_type=="comment" && wordpressId == $id][0]`, { id: wpComment.databaseId })
        if (existing) {
          // console.log(`- Comment ${wpComment.databaseId} exists.`)
          continue
        }

        // Create
        const doc = {
          _type: 'comment',
          name: wpComment.author?.node?.name || 'Anonymous',
          email: wpComment.author?.node?.email || '',
          comment: wpComment.content,
          post: { _type: 'reference', _ref: _id },
          approved: true,
          wordpressId: wpComment.databaseId,
          parentCommentId: wpComment.parentDatabaseId || 0,
          _createdAt: wpComment.date ? new Date(wpComment.date).toISOString() : new Date().toISOString()
        }

        await client.create(doc)
        process.stdout.write('.') // Progress dot
        totalImported++
      }
      console.log('') // Newline

    } catch (err) {
      console.error(`Error processing ${slug}:`, err.message)
    }
  }

  console.log(`\n--- Selesai ---\nTotal Komentar Diimpor: ${totalImported}`)
}

migrateComments()
