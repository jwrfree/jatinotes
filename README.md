# JatiNotes

Sebuah blog pribadi dan platform catatan digital yang dibangun menggunakan **Next.js** dan **Sanity Headless CMS**.

## Stack Teknologi

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **CMS**: Sanity.io (Embedded Studio) - Sebelumnya WordPress
- **Styling**: Tailwind CSS, Framer Motion
- **Deployment**: Vercel (Recommended)

## Persiapan Lokal

1.  **Clone Repository**
    ```bash
    git clone https://github.com/yourusername/jatinotes.git
    cd jatinotes
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Setup Environment Variables**
    Buat file `.env.local` dan isi dengan konfigurasi berikut:

    ```env
    NEXT_PUBLIC_SANITY_PROJECT_ID="0fd6j2sl"
    NEXT_PUBLIC_SANITY_DATASET="production"
    # SANITY_API_READ_TOKEN="optional_if_content_is_private"
    ```

4.  **Jalankan Server Development**
    ```bash
    npm run dev
    ```

    Buka [http://localhost:3000](http://localhost:3000) untuk melihat website.
    Buka [http://localhost:3000/studio](http://localhost:3000/studio) untuk mengakses CMS (Sanity Studio).

## Fitur Utama

- **Sanity Integration**: Konten dikelola sepenuhnya via Sanity Studio yang tertanam di website.
- **Portable Text**: Rendering rich text yang fleksibel dengan dukungan gambar (Image Zoom) dan code blocks.
- **Dynamic Routing**: Halaman blog, kategori, dan single post digenerate secara dinamis.
- **SEO Optimized**: Metadata otomatis untuk setiap halaman.
- **Dark Mode**: Dukungan tema gelap/terang.

## Catatan Migrasi (WordPress ke Sanity)

Proyek ini telah dimigrasikan dari WordPress Headless ke Sanity.
- **Schema**: Post, Author, Category, BlockContent.
- **Images**: Menggunakan Sanity Image Pipeline (`cdn.sanity.io`).
- **Legacy Support**: URL slug dipertahankan agar link lama tidak rusak.

## Lisensi

[MIT](LICENSE)
