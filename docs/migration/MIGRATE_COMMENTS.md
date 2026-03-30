# Panduan Migrasi Komentar WordPress ke Sanity

Berikut adalah langkah-langkah untuk mengimpor komentar lama dari WordPress ke sistem komentar baru di Sanity.

## Persiapan

1.  **Dapatkan Write Token Sanity**
    *   Buka [Sanity Management](https://sanity.io/manage).
    *   Pilih project `jatinotes`.
    *   Ke tab **API** > **Tokens** > **Add API Token**.
    *   Beri nama "Comment Write Token" dan pilih permission **Editor**.
    *   Copy token tersebut.

2.  **Update Environment Variables**
    *   Buka file `.env.local` di root project.
    *   Tambahkan baris berikut:
        ```env
        SANITY_API_WRITE_TOKEN="token_anda_disini"
        ```

3.  **Siapkan Data Komentar (JSON)**
    *   Export komentar dari WordPress Anda (gunakan plugin atau script export).
    *   Ubah formatnya menjadi JSON array seperti contoh `comments-to-import.json`.
    *   Simpan file tersebut di root folder project dengan nama `comments-to-import.json`.

    **Contoh Format `comments-to-import.json`:**
    ```json
    [
      {
        "postSlug": "judul-postingan-anda", 
        "author": "Nama Pengirim",
        "email": "email@pengirim.com",
        "content": "Isi komentar yang panjang...",
        "date": "2023-01-01T10:00:00Z"
      },
      {
        "postSlug": "postingan-lain",
        "author": "Budi",
        "email": "budi@example.com",
        "content": "Tulisan yang bagus!",
        "date": "2023-02-15T14:30:00Z"
      }
    ]
    ```
    > **Catatan:** `postSlug` harus sesuai dengan slug yang ada di Sanity/Website Anda saat ini.

## Menjalankan Migrasi

1.  Buka terminal di root project.
2.  Jalankan perintah:
    ```bash
    node scripts/import-comments.mjs
    ```
3.  Script akan memproses setiap komentar, mencocokkan post berdasarkan slug, dan menguploadnya ke Sanity.
4.  Cek output di terminal untuk melihat status sukses/gagal.

## Opsi 2: Migrasi Otomatis via WordPress GraphQL (Recommended)

Jika website WordPress lama Anda masih aktif dan memiliki endpoint GraphQL (misal WPGraphQL plugin):

1.  **Pastikan Konfigurasi .env.local**
    Pastikan file `.env.local` memiliki:
    ```env
    WORDPRESS_API_URL="https://domainanda.com/graphql"
    SANITY_API_WRITE_TOKEN="token_anda"
    ```

2.  **Jalankan Script Migrasi**
    Buka terminal dan jalankan:
    ```bash
    node scripts/migrate-from-graphql.mjs
    ```
    Script ini akan:
    - Terhubung ke WordPress Anda.
    - Mengambil semua komentar secara bertahap.
    - Mencocokkan komentar dengan Post yang ada di Sanity (berdasarkan slug).
    - Mengupload komentar ke Sanity.

## Verifikasi

Setelah selesai, buka halaman post di website atau di Sanity Studio untuk melihat komentar yang sudah diimpor.
