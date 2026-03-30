import { getCliClient } from 'sanity/cli'

const client = getCliClient()

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '')       // Trim - from end of text
}

const PARENT_SLUG = 'buku'
const NEW_GENRES = [
    // New Genres
    { title: 'Biografi & Memoar', description: 'Kisah hidup tokoh-tokoh inspiratif' },
    { title: 'Bisnis & Keuangan', description: 'Wawasan dunia bisnis, investasi, dan ekonomi' },
    { title: 'Filosofi', description: 'Buku-buku tentang pemikiran dan kebijaksanaan' },
    { title: 'Psikologi', description: 'Memahami pikiran dan perilaku manusia' },
    { title: 'Sains', description: 'Pengetahuan alam dan ilmiah populer' },
    { title: 'Sastra & Klasik', description: 'Karya sastra abadi dan novel klasik' },
    { title: 'Fantasi & Sci-Fi', description: 'Dunia imajinasi, sihir, dan masa depan' },
    { title: 'Misteri & Thriller', description: 'Kisah penuh teka-teki dan ketegangan' },

    // Existing Genres (Ensure Description)
    { title: 'Fiksi', description: 'Kisah imajinatif yang mengajak berpetualang ke dunia lain' },
    { title: 'Non Fiksi', description: 'Karya faktual yang memperluas wawasan dan pengetahuan' },
    { title: 'Pengembangan Diri', description: 'Panduan untuk bertumbuh menjadi versi terbaik diri sendiri' },
    { title: 'Sejarah', description: 'Memahami masa lalu untuk melangkah ke masa depan' },
    { title: 'Review', description: 'Ulasan dan kritik mendalam tentang berbagai buku' }
]

async function seedGenres() {
    console.log('📚 Mulai seeding/updating genre buku...')

    // 1. Cari Parent ID (Buku)
    const parent = await client.fetch(`*[_type == "category" && slug.current == "${PARENT_SLUG}"][0]`)

    if (!parent) {
        console.error(`❌ Parent category '${PARENT_SLUG}' tidak ditemukan! Pastikan kategori 'Buku' sudah dibuat.`)
        return
    }

    const parentId = parent._id
    console.log(`ℹ️  Parent '${PARENT_SLUG}' ditemukan: ${parentId}`)

    // 2. Loop & Create/Update Genres
    for (const genre of NEW_GENRES) {
        const slug = slugify(genre.title)

        // Cek apakah kategori sudah ada
        const existing = await client.fetch(`*[_type == "category" && slug.current == "${slug}"][0]`)

        if (existing) {
            console.log(`⏭️  Genre '${genre.title}' sudah ada. Mengecek kelengkapan...`)

            const patch = client.patch(existing._id)
            let needsUpdate = false
            const updates: Record<string, unknown> = {}

            // Update Parent if needed
            if (existing.parent?._ref !== parentId) {
                console.log(`   🔄 Memperbaiki parent...`)
                updates.parent = { _type: 'reference', _ref: parentId }
                needsUpdate = true
            }

            // Update Description if missing or updated
            if (!existing.description || existing.description !== genre.description) {
                console.log(`   📝 Mengupdate deskripsi...`)
                updates.description = genre.description
                needsUpdate = true
            }

            if (needsUpdate) {
                await patch.set(updates).commit()
                console.log(`   ✅ Data '${genre.title}' diperbarui!`)
            } else {
                console.log(`   ✨ Data sudah up-to-date.`)
            }

        } else {
            console.log(`🆕 Membuat genre baru: '${genre.title}'...`)
            try {
                await client.create({
                    _type: 'category',
                    title: genre.title,
                    slug: { current: slug },
                    description: genre.description,
                    parent: { _type: 'reference', _ref: parentId }
                })
                console.log(`   ✅ Berhasil dibuat!`)
            } catch (err: unknown) {
                console.error(`   ❌ Gagal membuat '${genre.title}':`, err instanceof Error ? err.message : 'Unknown error')
            }
        }
    }

    console.log('✨ Seeding selesai!')
}

seedGenres().catch((err) => {
    console.error('Fatal Error:', err)
    process.exit(1)
})
