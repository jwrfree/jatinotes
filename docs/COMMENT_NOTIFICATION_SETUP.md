# Setup Notifikasi Komentar Sanity

## Cara Setup Webhook di Sanity Studio

1. **Buka Sanity Studio**
   - Buka `https://jatinotes.com/studio` atau Sanity Studio Anda
   - Login dengan akun Sanity Anda

2. **Masuk ke Settings → API**
   - Klik menu "Settings" di sidebar
   - Pilih tab "API"
   - Scroll ke bagian "Webhooks"

3. **Tambah Webhook Baru**
   - Klik tombol "Add webhook"
   - Isi form dengan:

   **Basic Settings:**
   - **Name**: `Komentar Baru Notification`
   - **Description**: `Notifikasi ketika ada komentar baru`
   - **URL**: `https://jatinotes.com/api/webhooks/comment-notification`
   - **Dataset**: Pilih dataset Anda (biasanya `production`)

   **Trigger Settings:**
   - **Trigger on**: ✅ Create (centang saja)
   - **Filter**: `_type == "comment"`
   - **Projection**: (kosongkan, biar dapat data lengkap)

   **Security:**
   - **Secret**: Buat secret random (contoh: `sk_comment_webhook_2024`)
   - **HTTP Method**: `POST`

4. **Simpan Webhook**
   - Klik "Save webhook"
   - Copy secret yang sudah dibuat

5. **Update Environment Variables**
   ```bash
   # Copy .env.local.example ke .env.local
   cp .env.local.example .env.local
   
   # Edit .env.local dan tambahkan:
   SANITY_WEBHOOK_SECRET=sk_comment_webhook_2024  # Secret dari langkah 3
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=password_anda_yang_kuat
   
   # Opsional - untuk email notifikasi:
   RESEND_API_KEY=your_resend_api_key
   ADMIN_EMAIL=email_anda@example.com
   
   # Opsional - untuk Discord notifikasi:
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
   ```

6. **Restart Aplikasi**
   ```bash
   npm run dev
   ```

## Cara Test Webhook

1. **Test via Sanity Studio:**
   - Buka bagian Comments di Sanity Studio
   - Buat komentar baru (bisa via form di website)
   - Cek email atau Discord Anda

2. **Test via Website:**
   - Buka salah satu post di website
   - Tambahkan komentar baru
   - Anda akan menerima notifikasi

## Cara Akses Dashboard Admin

1. **Buka Dashboard:**
   - Buka `https://jatinotes.com/admin/dashboard`
   - Login dengan username & password dari `.env.local`

2. **Monitor Komentar:**
   - Lihat semua komentar di dashboard
   - Klik "Buka di Studio" untuk moderasi
   - Refresh untuk melihat komentar baru

## Troubleshooting

### Webhook tidak terkirim?
- Cek URL webhook di Sanity (harus HTTPS untuk production)
- Cek secret di `.env.local` sudah sesuai
- Cek logs di Vercel/ hosting Anda
- Test dengan webhook.site dulu

### Tidak menerima email?
- Cek `RESEND_API_KEY` sudah benar
- Cek `ADMIN_EMAIL` sudah diisi
- Cek spam folder email Anda

### Dashboard tidak bisa diakses?
- Cek `ADMIN_USERNAME` dan `ADMIN_PASSWORD`
- Cek middleware.ts sudah benar
- Cek environment variables sudah di-set

## Alternatif Lain (Tanpa Webhook)

Jika webhook terlalu ribet, Anda bisa:

1. **Cek langsung di Sanity Studio:**
   - Buka `https://sanity.io/manage`
   - Pilih project Anda
   - Klik "Comments" di sidebar

2. **Gunakan Sanity Vision:**
   - Di Studio, buka "Vision" tool
   - Query: `*[_type == "comment"] | order(_createdAt desc)`

3. **Mobile App Sanity:**
   - Download Sanity app di iOS/Android
   - Dapat notifikasi push (jika tersedia)

## Butuh Bantuan?

- Discord: Sanity Community
- GitHub Issues: Repository ini
- Email: [email Anda]