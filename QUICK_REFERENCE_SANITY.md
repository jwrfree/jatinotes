# Quick Reference: Menulis Blog Baru di Sanity Studio

## 🚀 Akses Sanity Studio

1. Buka browser: **http://localhost:3333**
2. Login dengan akun Sanity Anda

---

## ✍️ Membuat Post Baru (Step-by-Step)

### 1️⃣ **Tab Content** (Default)

#### Title
- Ketik judul artikel
- **Hint:** 10-100 karakter
- Contoh: "Cara Meningkatkan Produktivitas dengan Teknik Pomodoro"

#### Slug
- Klik tombol **"Generate"** untuk auto-generate dari title
- Atau edit manual jika perlu
- **Required**

#### Excerpt
- Tulis ringkasan singkat (1-2 kalimat)
- **Hint:** 50-160 karakter untuk SEO optimal
- Ini akan muncul di card preview & meta description
- **Required**

#### Body
- Tulis konten artikel lengkap
- Gunakan formatting: heading, bold, italic, link, dll
- **Required**

#### Featured Image
- Upload gambar utama (recommended: 1200x630px)
- **Wajib isi Alt Text** untuk SEO
- Gunakan hotspot untuk crop yang tepat
- **Required**

---

### 2️⃣ **Tab Metadata**

#### Categories
- Pilih 1-3 kategori yang relevan
- **Hint:** Jangan terlalu banyak
- **Required**

#### Published Date
- ✅ **Sudah auto-set ke hari ini!**
- Edit jika perlu (untuk backdate/schedule)
- **Required**

#### Featured Post
- Toggle ON jika artikel ini unggulan
- Akan ditampilkan prominent di homepage
- Default: OFF

#### Author
- ✅ **Hidden (auto-set ke Anda)**
- Karena blog ini single-author, field ini disembunyikan
- Jika perlu edit, klik "Show hidden fields" (icon mata)

---

### 3️⃣ **Tab SEO** (Opsional)

#### SEO Settings
- Opsional - akan auto-generate dari title & excerpt jika kosong
- Custom SEO title, description, keywords
- Open Graph image

---

### 4️⃣ **Publish**

- Klik tombol **"Publish"** di kanan atas
- Artikel akan langsung live di website!

---

## 🎨 Tips & Best Practices

### ✅ Checklist Sebelum Publish

- [ ] Title menarik & deskriptif (50-70 karakter)
- [ ] Slug sudah di-generate
- [ ] Excerpt informatif (120-160 karakter)
- [ ] Featured image sudah upload + alt text
- [ ] Body lengkap dengan formatting yang baik
- [ ] Author sudah dipilih
- [ ] 1-3 kategori sudah dipilih
- [ ] Tanggal publish sudah benar
- [ ] Preview terlihat bagus

### 📝 Writing Tips

**Title:**
- Gunakan kata kunci utama
- Buat menarik & clickable
- Hindari clickbait berlebihan

**Excerpt:**
- Jawab: "Apa yang pembaca akan dapat?"
- Gunakan kata kunci
- Buat penasaran tapi informatif

**Body:**
- Gunakan heading (H2, H3) untuk struktur
- Paragraf pendek (2-4 kalimat)
- Gunakan bullet points untuk list
- Tambahkan gambar jika perlu
- Link ke sumber/referensi

**Featured Image:**
- Relevan dengan konten
- Kualitas tinggi
- Alt text deskriptif

---

## 🔧 Shortcuts & Tricks

### Keyboard Shortcuts (di Body Editor)
- `Ctrl + B` - Bold
- `Ctrl + I` - Italic
- `Ctrl + K` - Add link
- `Ctrl + S` - Save draft

### Auto-features
- ✅ Tanggal publish auto-set ke hari ini
- ✅ Slug auto-generate dari title
- ✅ Validasi otomatis dengan warnings
- ✅ Character counter untuk SEO

---

## 📊 Field Validations

| Field | Min | Max | Required | Notes |
|-------|-----|-----|----------|-------|
| Title | 10 | 100 | ✅ | Warning jika di luar range |
| Slug | - | 96 | ✅ | Auto-generate |
| Excerpt | 50 | 160 | ✅ | Optimal untuk SEO |
| Body | - | - | ✅ | Rich text |
| Featured Image | - | - | ✅ | + Alt text required |
| Author | - | - | ✅ | Reference |
| Categories | 1 | 3 | ✅ | Warning jika > 3 |
| Published Date | - | - | ✅ | Auto-set today |

---

## 🐛 Troubleshooting

### "Cannot publish" error
- Cek semua required fields sudah diisi
- Lihat validation warnings (icon merah/kuning)
- Pastikan slug unique (tidak duplikat)

### Preview tidak muncul
- Refresh browser
- Cek apakah featured image sudah upload
- Pastikan title sudah diisi

### Tanggal tidak auto-set
- Refresh Sanity Studio
- Clear browser cache
- Create new post (bukan duplicate)

---

## 📱 Preview Post

Setelah publish, cek di:
- **Homepage:** http://localhost:3000
- **Single Post:** http://localhost:3000/posts/[slug]
- **Category Page:** http://localhost:3000/[category]/[slug]

---

**Happy Writing! ✍️🚀**
