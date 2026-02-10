import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const parentSlug = 'buku'
const childSlugs = ['fiksi', 'non-fiksi', 'pengembangan-diri', 'sejarah', 'review']

async function migrate() {
    console.log('🚀 Mulai migrasi kategori...')

    // 1. Cari Parent ID (Buku)
    const parent = await client.fetch(`*[_type == "category" && slug.current == "${parentSlug}"][0]`)

    if (!parent) {
        console.error(`❌ Parent category '${parentSlug}' tidak ditemukan! Pastikan kategori 'Buku' sudah dibuat.`)
        return
    }

    const parentId = parent._id
    console.log(`ℹ️  Parent '${parentSlug}' ditemukan dengan ID: ${parentId}`)

    // 2. Loop setiap kategori target & Update parent-nya
    for (const slug of childSlugs) {
        const category = await client.fetch(`*[_type == "category" && slug.current == "${slug}"][0]`)

        if (category) {
            // Cek apakah sudah punya parent yang sama (untuk menghindari update redundant)
            if (category.parent?._ref === parentId) {
                console.log(`⏭️  '${slug}' sudah benar parent-nya. Skip.`)
                continue
            }

            console.log(`🔄 Updating category '${slug}'...`)

            try {
                await client.patch(category._id)
                    .set({
                        parent: {
                            _type: 'reference',
                            _ref: parentId
                        }
                    })
                    .commit()
                console.log(`✅ '${slug}' BERHASIL dipindah ke '${parentSlug}'`)
            } catch (error) {
                console.error(`❌ Gagal update '${slug}':`, error)
            }

        } else {
            console.warn(`⚠️  WARNING: Kategori '${slug}' tidak ditemukan di database.`)
        }
    }

    console.log('✨ Migrasi selesai!')
}

migrate().catch((err) => {
    console.error('Fatal Error:', err)
    process.exit(1)
})
