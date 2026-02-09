
import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load env
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
})

async function checkComments() {
    console.log('Checking comments in Sanity...')
    // Fetch comments to inspect their data, specially parentCommentId and wordpressId relations
    const comments = await client.fetch(`*[_type == "comment"]{
    _id,
    name,
    comment,
    approved,
    parentCommentId,
    wordpressId,
    "postSlug": post->slug.current
  }`)

    if (comments.length === 0) {
        console.log('❌ TIDAK ADA KOMENTAR di Sanity.')
    } else {
        console.log(`✅ Ditemukan ${comments.length} komentar:`)
        console.log(JSON.stringify(comments, null, 2))
    }
}

checkComments()
