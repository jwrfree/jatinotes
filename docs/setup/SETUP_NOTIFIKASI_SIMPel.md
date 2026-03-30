# 🔧 Setup Notifikasi Email - Langsung Pakai!

## ⚡ Langkah Super Cepat (2 Menit)

### 1. Daftar Resend (Gratis)
```
1. Buka https://resend.com
2. Klik "Get Started" 
3. Daftar dengan email Anda
4. Verifikasi email
```

### 2. Dapat API Key
```
1. Login ke Resend
2. Klik "API Keys" di sidebar
3. Klik "Create API Key"
4. Nama: "jatinotes-webhook"
5. Copy API key (mulai dengan re_)
```

### 3. Update Environment (Sekali Klik!)
**File:** `.env.local` (sudah ada di project)

**Yang perlu diisi hanya 3 baris:**
```env
# 🔑 ISI DENGAN DATA ANDA:
RESEND_API_KEY=re_YOUR_API_KEY_HERE        # ← Paste API key dari Resend
ADMIN_EMAIL=email_anda@gmail.com            # ← Email untuk menerima notifikasi
FROM_EMAIL=notifications@resend.dev         # ← Email pengirim (default sudah benar)

# ✅ Yang lainnya sudah otomatis terisi:
SANITY_WEBHOOK_SECRET=sk_comment_webhook_2024_jatinotes_secure
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123_jatinotes_secure
```

### 4. Setup Webhook di Sanity (Sekali Setting)
```
1. Buka https://jatinotes.com/studio
2. Settings → API → Webhooks
3. Add Webhook:
   - Name: Komentar Baru
   - URL: https://jatinotes.com/api/webhooks/comment-notification
   - Filter: _type == "comment"
   - Trigger: ✅ Create
   - Secret: sk_comment_webhook_2024_jatinotes_secure
4. Save!
```

### 5. Test! 🎉
```
1. Buka https://jatinotes.com/blog/[nama-post]
2. Tambah komentar baru
3. Cek email Anda dalam 10 detik!
```

---

## 📧 Contoh Email yang Akan Anda Terima

Subject: `💬 Komentar Baru: Nama Pengunjung di JatiNotes`

Isi email akan berisi:
- Nama dan email pengunjung
- Isi komentar lengkap
- Waktu komentar
- Tombol untuk moderasi di Sanity Studio
- Link ke dashboard admin

---

## 🎯 Dashboard Admin

Akses: `https://jatinotes.com/admin/dashboard`
Login: admin / admin123_jatinotes_secure

Fitur:
- Lihat semua komentar
- Statistik komentar
- Link ke Sanity Studio
- Refresh real-time

---

## ⚠️ Troubleshooting Cepat

**Email tidak masuk?**
- Cek spam folder
- Cek RESEND_API_KEY sudah benar
- Cek ADMIN_EMAIL sudah diisi

**Webhook error?**
- Cek secret webhook di Sanity
- Cek URL webhook (harus HTTPS)

**Dashboard tidak bisa dibuka?**
- Cek ADMIN_USERNAME dan ADMIN_PASSWORD
- Cek middleware.ts

---

## 🚀 Alternatif Super Simpel

Kalau semua ini terlalu ribet, cukup:
1. Bookmark: `https://jatinotes.com/admin/dashboard`
2. Cek komentar di sana
3. Selesai!

Tapi dengan email notifikasi, Anda gak akan ketinggalan komentar baru lagi! 📧✨