
import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load env
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true })

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL

async function debugGraphQL() {
  console.log(`Connecting to WordPress: ${WORDPRESS_API_URL}`)

  const query = `
    query {
      comments(first: 1) {
        nodes {
          databaseId
          commentedOn {
             node {
               databaseId
               __typename
             }
          }
        }
      }
    }
  `

  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2))
  } else {
    // Check available fields on Comment type
    console.log(JSON.stringify(json, null, 2).substring(0, 2000))
  }
}

debugGraphQL()
