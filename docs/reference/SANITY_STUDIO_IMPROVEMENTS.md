# Peningkatan UI/UX Sanity Studio

## 📝 Ringkasan Perubahan

Sanity Studio telah disempurnakan dengan berbagai fitur untuk membuat pengalaman menulis blog lebih nyaman dan efisien.

---

## ✨ Fitur Baru - Post Schema

### 1. **Auto-set Tanggal Publish** ✅
- Tanggal publikasi otomatis di-set ke hari ini saat membuat post baru
- Tidak perlu manual input tanggal lagi!

### 2. **Field Grouping**
Post fields sekarang dikelompokkan dalam 3 tab:
- **Content** (default): Title, Slug, Excerpt, Body, Featured Image
- **Metadata**: Author, Categories, Published Date, Featured Post
- **SEO**: SEO Settings

### 3. **Smart Validations**
Validasi otomatis dengan pesan yang jelas:
- **Title**: 10-100 karakter (required)
- **Excerpt**: 50-160 karakter untuk SEO optimal (required)
- **Categories**: 1-3 kategori (required)
- **Featured Image**: Alt text wajib untuk SEO
- **Slug**: Auto-generate dari title (required)

### 4. **Helpful Descriptions**
Setiap field memiliki deskripsi yang jelas:
- Apa fungsinya
- Contoh pengisian
- Best practices

### 5. **Enhanced Preview**
Preview post sekarang menampilkan:
- Judul
- Penulis
- Tanggal publikasi (format Indonesia)
- Jumlah kategori
- Featured image

Contoh: `Jati Wibowo • 10 Feb 2026 • 2 kategori`

### 6. **Custom Ordering**
Sorting options baru:
- Published Date (Newest → Oldest)
- Published Date (Oldest → Newest)
- Title (A-Z)

### 7. **Featured Post Toggle**
Field baru untuk menandai artikel unggulan yang akan ditampilkan di homepage

---

## 🏷️ Fitur Baru - Category Schema

### 1. **Color Field**
- Tambahkan warna untuk badge kategori
- Format hex color (contoh: #3B82F6)
- Validasi otomatis format hex

### 2. **Validations**
- Title: 2-50 karakter (required)
- Slug: Auto-generate (required)
- Color: Hex format validation

### 3. **Enhanced Preview**
Preview menampilkan title dan description

---

## 👤 Fitur Baru - Author Schema

### 1. **Simplified Bio**
- Bio diubah dari rich text menjadi plain text
- Lebih simple dan cepat
- Max 300 karakter dengan warning

### 2. **Social Media Links**
Field baru untuk link social media:
- Twitter/X
- LinkedIn
- GitHub
- Personal Website

### 3. **Email Field**
- Email penulis dengan validasi format
- Opsional

### 4. **Enhanced Preview**
Preview menampilkan:
- Nama
- Bio (60 karakter pertama)
- Profile image

---

## 🎯 Workflow Menulis Blog Baru

### Sebelum (Old Workflow):
1. Buka Sanity Studio
2. Create new Post
3. Isi Title
4. Generate Slug
5. **Manual set tanggal publish** ⏰
6. Pilih Author
7. Upload Image
8. Pilih Categories
9. Tulis Excerpt
10. Tulis Body
11. Isi SEO Settings
12. Publish

### Sesudah (New Workflow):
1. Buka Sanity Studio
2. Create new Post
3. **Tab Content:**
   - Isi Title (dengan hint: 10-100 karakter)
   - Klik "Generate" untuk Slug
   - Tulis Excerpt (dengan hint: 50-160 karakter untuk SEO)
   - Tulis Body
   - Upload Featured Image + Alt Text
4. **Tab Metadata:**
   - Pilih Author
   - Pilih Categories (1-3)
   - ✅ **Tanggal sudah auto-set ke hari ini!**
   - Toggle "Featured Post" jika perlu
5. **Tab SEO** (opsional):
   - Isi custom SEO jika perlu
6. Publish

**Hemat waktu & lebih terorganisir!** 🚀

---

## 📊 Perbandingan Fitur

| Fitur | Sebelum | Sesudah |
|-------|---------|---------|
| Auto-set Publish Date | ❌ Manual | ✅ Auto (hari ini) |
| Field Grouping | ❌ Semua campur | ✅ 3 tabs terorganisir |
| Validations | ❌ Minimal | ✅ Comprehensive |
| Field Descriptions | ❌ Tidak ada | ✅ Semua field |
| Character Counter | ❌ Tidak ada | ✅ Ada (title, excerpt, bio) |
| Preview Info | ⚠️ Basic | ✅ Rich (author, date, categories) |
| Sorting Options | ⚠️ Default only | ✅ 3 custom sorts |
| Featured Post | ❌ Tidak ada | ✅ Ada |
| Category Color | ❌ Tidak ada | ✅ Ada |
| Author Social Media | ❌ Tidak ada | ✅ Ada (4 platforms) |
| Alt Text for Images | ❌ Opsional | ✅ Required (SEO) |

---

## 🎨 Tips Penggunaan

### 1. **Menulis Judul yang Baik**
- Panjang ideal: 50-70 karakter
- Gunakan kata kunci utama
- Buat menarik dan deskriptif
- Validasi akan warning jika terlalu pendek/panjang

### 2. **Menulis Excerpt yang Efektif**
- Panjang ideal: 120-160 karakter
- Ringkas isi artikel
- Gunakan kata kunci
- Ini akan muncul di:
  - Card preview
  - Meta description (SEO)
  - Social media shares

### 3. **Memilih Kategori**
- Pilih 1-3 kategori yang relevan
- Jangan terlalu banyak (akan warning)
- Gunakan warna kategori untuk visual branding

### 4. **Featured Image Best Practices**
- Ukuran recommended: 1200x630px
- Format: JPG atau PNG
- **Wajib isi Alt Text** untuk SEO & accessibility
- Gunakan hotspot untuk crop yang tepat

### 5. **Featured Post**
- Tandai artikel terbaik/terpopuler
- Akan ditampilkan prominent di homepage
- Jangan terlalu banyak (3-5 artikel)

---

## 🔧 Konfigurasi Tambahan (Opsional)

### Menambah Warna Default untuk Kategori Baru

Edit `category.ts` dan tambahkan `initialValue`:

```typescript
defineField({
    name: 'color',
    title: 'Color',
    type: 'string',
    initialValue: '#3B82F6', // Default blue
    // ...
}),
```

### Menambah Field Custom di Post

Contoh menambah field "Reading Time":

```typescript
defineField({
    name: 'readingTime',
    title: 'Reading Time',
    type: 'number',
    description: 'Estimasi waktu baca (menit)',
    validation: (Rule) => Rule.min(1).max(60),
    group: 'meta',
}),
```

---

## 🐛 Troubleshooting

### Tanggal tidak auto-set?
- Pastikan Sanity Studio sudah di-restart
- Clear browser cache
- Cek console untuk error

### Validasi tidak muncul?
- Pastikan sudah save schema
- Restart Sanity Studio
- Cek syntax error di schema file

### Preview tidak update?
- Refresh Sanity Studio
- Cek field names di preview.select
- Pastikan data sudah tersimpan

---

## 📚 Resources

### Sanity Documentation
- [Schema Types](https://www.sanity.io/docs/schema-types)
- [Validation](https://www.sanity.io/docs/validation)
- [Initial Values](https://www.sanity.io/docs/initial-value-templates)
- [Previews](https://www.sanity.io/docs/previews-list-views)

### Best Practices
- [Content Modeling](https://www.sanity.io/guides/content-modeling)
- [SEO Best Practices](https://www.sanity.io/guides/seo)

---

## 🎉 Kesimpulan

Dengan peningkatan ini, menulis blog di Sanity Studio menjadi:
- ✅ **Lebih cepat** - Auto-set date, validations
- ✅ **Lebih terorganisir** - Field grouping, sorting
- ✅ **Lebih user-friendly** - Descriptions, hints, warnings
- ✅ **Lebih SEO-friendly** - Required alt text, excerpt validation
- ✅ **Lebih fleksibel** - Featured posts, category colors, social media

**Happy blogging! 🚀**

---

**Dibuat:** 2026-02-10  
**Project:** Jatinotes Next.js + Sanity  
**Version:** 2.0
