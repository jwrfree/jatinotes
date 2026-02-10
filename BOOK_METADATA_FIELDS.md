# Book Metadata Fields - Sanity Schema

## 📚 Overview

Field baru ditambahkan ke Post schema untuk menyimpan metadata buku (judul buku & pengarang) yang hanya muncul untuk post kategori "Buku".

---

## ✨ Fitur Baru

### 1. **Book Title Field** (`bookTitle`)
- **Type:** String
- **Label:** "Judul Buku"
- **Description:** "Judul buku yang direview (hanya untuk post kategori Buku)"
- **Visibility:** Hidden kecuali post punya kategori "Buku"
- **Group:** Metadata

### 2. **Book Author Field** (`bookAuthor`)
- **Type:** String
- **Label:** "Pengarang Buku"
- **Description:** "Nama pengarang buku (hanya untuk post kategori Buku)"
- **Visibility:** Hidden kecuali post punya kategori "Buku"
- **Group:** Metadata

---

## 🎯 Cara Kerja

### Conditional Visibility

Fields ini menggunakan `hidden` function yang check apakah post memiliki kategori "buku":

```typescript
hidden: ({ document }) => {
    const categories = document?.categories as any[];
    return !categories?.some((cat: any) => 
        cat._ref?.includes('buku') || cat.slug === 'buku'
    );
}
```

**Behavior:**
- ✅ **Show:** Jika post punya kategori "Buku"
- ❌ **Hide:** Jika post tidak punya kategori "Buku"

---

## 📝 Cara Menggunakan di Sanity Studio

### Step 1: Buat Post Baru
1. Buka Sanity Studio: http://localhost:3333
2. Create new Post
3. Tab **Content**: Isi title, slug, excerpt, body, image

### Step 2: Pilih Kategori "Buku"
1. Tab **Metadata**
2. **Categories**: Pilih "Buku" (atau subcategory seperti "Pengembangan Diri", "Sejarah", dll)
3. **Field baru akan muncul otomatis!** ✨

### Step 3: Isi Metadata Buku
1. **Judul Buku**: Masukkan judul buku asli (contoh: "Atomic Habits")
2. **Pengarang Buku**: Masukkan nama pengarang (contoh: "James Clear")
3. Isi field lainnya (Published Date, Featured Post, dll)
4. **Publish**

---

## 🔄 Backward Compatibility

Halaman `/buku/reviews` sudah diupdate dengan **fallback logic** untuk post lama yang belum punya field baru:

### Priority Order:

#### Book Title:
1. ✅ **bookTitle field** (jika ada)
2. ⚠️ **Hardcoded mapping** (untuk post lama)
3. 🔧 **Clean title** (dari post title)

#### Book Author:
1. ✅ **bookAuthor field** (jika ada)
2. ⚠️ **Hardcoded mapping** (untuk post lama)
3. 🏷️ **Tags** (fallback)
4. ❌ **"Penulis belum diisi"** (placeholder)

---

## 📊 Contoh Penggunaan

### Post Baru (Dengan Field):
```
Title: "Review Buku Atomic Habits: Cara Membangun Kebiasaan Baik"
Book Title: "Atomic Habits"
Book Author: "James Clear"
Categories: ["Buku", "Pengembangan Diri"]
```

**Hasil di Daftar Buku:**
- Judul: **Atomic Habits** ← dari bookTitle
- Pengarang: **James Clear** ← dari bookAuthor

### Post Lama (Tanpa Field):
```
Title: "Kenapa buku quiet bikin Aku merasa dimengerti"
Book Title: (kosong)
Book Author: (kosong)
Categories: ["Buku", "Pengembangan Diri"]
```

**Hasil di Daftar Buku:**
- Judul: **Quiet** ← dari hardcoded mapping
- Pengarang: **Susan Cain** ← dari hardcoded mapping

---

## 🛠️ Technical Details

### Schema Changes:
- **File:** `src/sanity/schemaTypes/post.ts`
- **Fields Added:** `bookTitle`, `bookAuthor`
- **Conditional Logic:** Based on categories

### Query Changes:
- **File:** `src/sanity/lib/queries.ts`
- **Updated:** `postFields` to include `bookTitle` and `bookAuthor`

### Page Changes:
- **File:** `src/app/buku/reviews/page.tsx`
- **Updated:** Helper functions with fallback logic
- **Removed:** 100+ lines of hardcoded mappings

---

## ✅ Benefits

### Before:
- ❌ Hardcoded mapping untuk setiap buku (100+ lines)
- ❌ Harus update code setiap ada buku baru
- ❌ Tidak fleksibel
- ❌ Prone to errors

### After:
- ✅ Dynamic dari Sanity CMS
- ✅ Tinggal isi field di Sanity Studio
- ✅ Fleksibel & scalable
- ✅ Backward compatible dengan post lama

---

## 📝 Migration Guide

### Untuk Post Lama:

Jika ingin update post lama agar menggunakan field baru:

1. Buka post di Sanity Studio
2. Tab Metadata
3. Pastikan kategori "Buku" sudah dipilih
4. Field "Judul Buku" dan "Pengarang Buku" akan muncul
5. Isi dengan data yang benar
6. Save & Publish

**Note:** Post lama tetap akan berfungsi dengan fallback logic, jadi migration tidak wajib.

---

## 🎨 UI/UX

### Desktop:
```
┌─────────────────────────────────────────────────────┐
│ Tanggal │ Judul Buku      │ Penulis       │ Genre  │
├─────────┼─────────────────┼───────────────┼────────┤
│ 10 Feb  │ Atomic Habits   │ James Clear   │ Self   │
│ 9 Feb   │ Sapiens         │ Yuval Harari  │ Sejarah│
└─────────┴─────────────────┴───────────────┴────────┘
```

### Mobile:
```
┌──────────────────────────────┐
│ 10 Feb                       │
│ Atomic Habits                │
│ James Clear • Self           │
└──────────────────────────────┘
```

---

## 🚀 Future Enhancements

Possible additions:
- **ISBN field** - untuk link ke Goodreads/Amazon
- **Rating field** - rating 1-5 stars
- **Read Date field** - kapan selesai baca
- **Publisher field** - penerbit buku
- **Page Count field** - jumlah halaman
- **Language field** - bahasa buku

---

**Created:** 2026-02-10  
**Project:** Jatinotes Book Review System
