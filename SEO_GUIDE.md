# SEO Guide - JatiNotes (Yoast SEO Alternative)

## 🎯 Overview

JatiNotes sekarang memiliki **fitur SEO lengkap** yang mirip dengan **Yoast SEO** di WordPress! Anda bisa mengontrol semua aspek SEO langsung dari Sanity Studio.

---

## ✨ Fitur SEO yang Tersedia

### 1. **Meta Title** (SEO Title)
- Custom title untuk search engines
- Rekomendasi: 50-60 karakter
- Jika kosong, akan menggunakan judul post

### 2. **Meta Description**
- Custom description untuk search results
- Rekomendasi: 150-160 karakter
- Jika kosong, akan menggunakan excerpt

### 3. **Focus Keyword**
- Keyword utama untuk konten (seperti Yoast)
- Membantu Anda fokus pada topik utama

### 4. **Social Share Image** (OG Image)
- Custom image untuk Facebook, Twitter, LinkedIn
- Jika kosong, akan menggunakan featured image
- Recommended size: 1200x630px

### 5. **Hide from Search Engines** (noindex)
- Checkbox untuk hide post dari Google
- Berguna untuk draft atau konten private

### 6. **Canonical URL**
- Custom canonical URL untuk duplicate content
- Opsional, biasanya tidak perlu diisi

---

## 📝 Cara Menggunakan di Sanity Studio

### Step 1: Buka Post di Studio
1. Akses http://localhost:3000/studio
2. Pilih post yang ingin di-edit
3. Scroll ke bawah sampai section **"SEO Settings"**

### Step 2: Isi SEO Fields
```
📋 SEO Settings
├── Meta Title: "Buku Quiet: Panduan Lengkap untuk Introvert"
├── Meta Description: "Review lengkap buku Quiet karya Susan Cain. Pelajari mengapa introvert memiliki kekuatan unik dan bagaimana memanfaatkannya."
├── Focus Keyword: "buku quiet introvert"
├── Social Share Image: [Upload custom image]
├── Hide from Search Engines: ☐ (unchecked)
└── Canonical URL: (leave empty)
```

### Step 3: Preview SEO
Setelah save, Anda bisa cek:
- **Google Preview**: Lihat bagaimana post muncul di search results
- **Social Preview**: Lihat bagaimana post muncul di Facebook/Twitter

---

## 🔍 SEO Best Practices

### ✅ DO's

1. **Meta Title**
   - Masukkan focus keyword di awal
   - Buat menarik dan clickable
   - Jangan lebih dari 60 karakter
   - Contoh: "Buku Quiet: Panduan Introvert | Review Lengkap"

2. **Meta Description**
   - Jelaskan isi konten dengan jelas
   - Masukkan focus keyword
   - Buat call-to-action
   - 150-160 karakter optimal
   - Contoh: "Review buku Quiet karya Susan Cain. Pelajari kekuatan introvert dan cara memanfaatkannya di dunia yang ramai. Baca selengkapnya!"

3. **Focus Keyword**
   - Pilih 1 keyword utama
   - Gunakan keyword yang dicari orang
   - Gunakan di title, description, dan konten
   - Contoh: "review buku quiet", "buku introvert"

4. **Images**
   - Gunakan image berkualitas tinggi
   - Size: 1200x630px untuk social sharing
   - Format: JPG atau PNG
   - Alt text yang descriptive

### ❌ DON'Ts

1. **Jangan keyword stuffing** - Jangan ulang keyword terlalu banyak
2. **Jangan clickbait** - Title harus sesuai dengan isi
3. **Jangan duplicate** - Setiap post harus punya meta description unik
4. **Jangan terlalu panjang** - Ikuti rekomendasi karakter

---

## 🚀 Fitur SEO Otomatis yang Sudah Ada

Bahkan tanpa mengisi SEO fields, JatiNotes sudah otomatis:

### ✅ Metadata Otomatis
- ✅ Title tags
- ✅ Meta descriptions (dari excerpt)
- ✅ Open Graph tags (Facebook)
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ JSON-LD structured data

### ✅ Technical SEO
- ✅ Semantic HTML
- ✅ Proper heading hierarchy (H1, H2, H3)
- ✅ Image optimization
- ✅ Mobile responsive
- ✅ Fast loading (Next.js)
- ✅ Sitemap (auto-generated)

### ✅ Content SEO
- ✅ Clean URLs (slug-based)
- ✅ Internal linking
- ✅ Category structure
- ✅ Author attribution
- ✅ Publish dates

---

## 📊 Perbandingan dengan Yoast SEO

| Feature | Yoast SEO (WordPress) | JatiNotes SEO | Status |
|---------|----------------------|---------------|--------|
| Meta Title | ✅ | ✅ | ✅ |
| Meta Description | ✅ | ✅ | ✅ |
| Focus Keyword | ✅ | ✅ | ✅ |
| OG Image | ✅ | ✅ | ✅ |
| Canonical URL | ✅ | ✅ | ✅ |
| noindex/nofollow | ✅ | ✅ | ✅ |
| Readability Analysis | ✅ | ❌ | Manual |
| Keyword Density | ✅ | ❌ | Manual |
| Internal Link Suggestions | ✅ | ❌ | Manual |
| Breadcrumbs | ✅ | 🔄 | Coming Soon |
| Schema Markup | ✅ | ✅ | ✅ |
| XML Sitemap | ✅ | ✅ | ✅ |

---

## 🛠️ Advanced: Schema Markup (JSON-LD)

JatiNotes otomatis generate **structured data** untuk setiap post:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "description": "Post Description",
  "image": "https://...",
  "datePublished": "2025-01-01",
  "author": {
    "@type": "Person",
    "name": "Wruhantojati"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Jati Notes"
  }
}
```

Ini membantu Google memahami konten Anda dan bisa muncul di **Rich Snippets**!

---

## 📈 Monitoring SEO

### Tools yang Recommended:

1. **Google Search Console**
   - Monitor ranking
   - Lihat search queries
   - Check indexing status

2. **Google Analytics**
   - Track traffic
   - Monitor user behavior
   - Conversion tracking

3. **Lighthouse (Chrome DevTools)**
   - Check SEO score
   - Performance audit
   - Accessibility check

### Cara Check SEO Score:

1. Buka post di browser
2. Klik kanan → Inspect
3. Tab "Lighthouse"
4. Run audit
5. Lihat SEO score (target: 90+)

---

## 🎓 SEO Checklist untuk Setiap Post

Sebelum publish post baru, pastikan:

- [ ] **Title** menarik dan ada keyword (50-60 char)
- [ ] **Meta description** informatif (150-160 char)
- [ ] **Focus keyword** sudah ditentukan
- [ ] **Featured image** berkualitas tinggi
- [ ] **Alt text** untuk semua gambar
- [ ] **Heading structure** benar (H1 → H2 → H3)
- [ ] **Internal links** ke post lain
- [ ] **External links** ke sumber terpercaya
- [ ] **Content** minimal 300 kata
- [ ] **Mobile-friendly** (test di mobile)
- [ ] **Loading speed** cepat

---

## 💡 Tips SEO untuk Blog

### 1. **Content is King**
- Tulis konten berkualitas (1000+ kata)
- Jawab pertanyaan pembaca
- Gunakan contoh dan data
- Update konten lama secara berkala

### 2. **Keyword Research**
- Gunakan Google Keyword Planner
- Cari long-tail keywords
- Analisis kompetitor
- Target keyword dengan volume tinggi tapi kompetisi rendah

### 3. **User Experience**
- Loading cepat (< 3 detik)
- Mobile-friendly
- Easy navigation
- Clear call-to-action

### 4. **Link Building**
- Internal linking antar post
- Guest posting
- Social media sharing
- Backlinks dari situs authority

---

## 🚀 Next Steps

1. **Isi SEO fields** untuk semua post existing
2. **Monitor** di Google Search Console
3. **Optimize** berdasarkan data
4. **Update** konten lama
5. **Build** backlinks

---

**Selamat! Sekarang blog Anda sudah SEO-ready seperti pakai Yoast SEO!** 🎉

Jika ada pertanyaan tentang SEO, silakan tanya!
