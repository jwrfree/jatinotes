/**
 * Script untuk mengimpor komentar dari WordPress (format JSON) ke Sanity
 * 
 * Cara Penggunaan:
 * 1. Siapkan file `comments-to-import.json` di root project dengan format:
 *    [
 *      {
 *        "postSlug": "judul-postingan-slug", // Slug post di Sanity
 *        "author": "Nama Pengirim",
 *        "email": "email@example.com",
 *        "content": "Isi komentar...",
 *        "date": "2023-01-01T12:00:00Z" // Opsional, default: now
 *      }
 *    ]
 * 2. Pastikan .env.local memiliki SANITY_API_WRITE_TOKEN
 * 3. Jalankan `node scripts/import-comments.mjs`
 */

import { createClient } from 'next-sanity'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env.local')

dotenv.config({ path: envPath })

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_WRITE_TOKEN) {
    console.error('Error: Missing environment variables.')
    console.error('Pastikan NEXT_PUBLIC_SANITY_PROJECT_ID dan SANITY_API_WRITE_TOKEN ada di .env.local')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
})

async function importComments() {
    const filePath = path.resolve(__dirname, '../comments-to-import.json')

    if (!fs.existsSync(filePath)) {
        console.error(`File ${filePath} tidak ditemukan.`)
        console.log('Silakan buat file "comments-to-import.json" di root project dengan format array JSON.')
        process.exit(1)
    }

    let comments = []
    try {
        const rawData = fs.readFileSync(filePath, 'utf8')
        comments = JSON.parse(rawData)
    } catch (error) {
        console.error('Gagal membaca file JSON:', error.message)
        process.exit(1)
    }

    console.log(`Membaca ${comments.length} komentar untuk diimpor...`)

    let successCount = 0
    let skipCount = 0
    let errorCount = 0

    for (const commentData of comments) {
        const { postSlug, author, email, content, date } = commentData

        if (!postSlug || !content) {
            console.warn(`Skipping comment: Missing postSlug or content.`)
            skipCount++
            continue
        }

        try {
            // 1. Cari Post berdasarkan slug
            const post = await client.fetch(
                `*[_type == "post" && slug.current == $slug][0]`,
                { slug: postSlug }
            )

            if (!post) {
                console.warn(`Post dengan slug "${postSlug}" tidak ditemukan. Skipping comment by ${author}.`)
                skipCount++
                continue
            }

            // 2. Buat dokumen komentar
            const doc = {
                _type: 'comment',
                name: author || 'Anonymous',
                email: email || '',
                comment: content,
                post: {
                    _type: 'reference',
                    _ref: post._id
                },
                approved: true, // Auto-approve komentar lama
                _createdAt: date ? new Date(date).toISOString() : new Date().toISOString()
            }

            const res = await client.create(doc)
            console.log(`✅ Imported: ${author} on ${postSlug} (ID: ${res._id})`)
            successCount++

        } catch (err) {
            console.error(`❌ Gagal import komentar untuk ${postSlug}:`, err.message)
            errorCount++
        }
    }

    console.log('\n--- Selesai ---')
    console.log(`Berhasil: ${successCount}`)
    console.log(`Dilewati: ${skipCount}`)
    console.log(`Gagal: ${errorCount}`)
}

importComments()
