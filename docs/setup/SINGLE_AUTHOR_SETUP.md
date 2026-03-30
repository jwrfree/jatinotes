# Setup Single Author Blog

## 🎯 Optimasi untuk Blog dengan Satu Penulis

Karena blog ini hanya memiliki satu author (Anda), beberapa optimasi telah dilakukan:

---

## ✅ Perubahan yang Sudah Dilakukan

### 1. **Author Field Hidden**
- Field "Author" sekarang **tersembunyi** di form Post
- Tidak perlu pilih-pilih author setiap kali buat post baru
- Form lebih clean dan cepat

### 2. **Simplified Workflow**
Sekarang workflow menulis blog jadi lebih cepat:

**Before:**
1. Isi Title
2. Generate Slug
3. **Pilih Author** ← tidak perlu lagi!
4. Upload Image
5. dst...

**After:**
1. Isi Title
2. Generate Slug
3. Upload Image
4. dst...

---

## 🔧 Setup Awal (One-Time Setup)

### Step 1: Buat Author Profile Anda

1. Buka Sanity Studio: http://localhost:3333
2. Klik **"Author"** di sidebar
3. Klik **"Create"** untuk buat author baru
4. Isi data Anda:
   - **Name:** Jati Wibowo (atau nama Anda)
   - **Slug:** Klik "Generate" dari name
   - **Profile Image:** Upload foto profil Anda
   - **Bio:** Tulis bio singkat (1-2 kalimat)
   - **Email:** Email Anda (opsional)
   - **Social Media:** (opsional)
     - Twitter/X: https://twitter.com/username
     - LinkedIn: https://linkedin.com/in/username
     - GitHub: https://github.com/username
     - Website: https://yourwebsite.com
5. Klik **"Publish"**

### Step 2: Set Author untuk Post yang Sudah Ada

Jika Anda punya post lama yang belum punya author:

1. Buka post tersebut di Sanity Studio
2. Klik tab **"Metadata"**
3. Scroll ke bawah, klik **"Show hidden fields"** (icon mata)
4. Pilih author Anda
5. Save

### Step 3: Set Default Author untuk Post Baru (Recommended)

Ada 2 cara:

#### **Opsi A: Manual (Setiap Kali Buat Post Baru)**
1. Buat post baru
2. Klik tab "Metadata"
3. Klik "Show hidden fields" (icon mata)
4. Pilih author Anda
5. Lanjut isi konten

#### **Opsi B: Auto dengan Initial Value Template (Recommended)**

Buat file `src/sanity/templates/post-template.ts`:

```typescript
import { defineTemplate } from 'sanity'

export default defineTemplate({
  id: 'post-with-author',
  title: 'Post (with default author)',
  schemaType: 'post',
  parameters: [],
  value: async (params) => {
    // Fetch your author ID
    const authorId = 'YOUR_AUTHOR_ID_HERE' // Replace with your actual author _id
    
    return {
      publishedAt: new Date().toISOString(),
      author: {
        _type: 'reference',
        _ref: authorId,
      },
    }
  },
})
```

Lalu import di `sanity.config.ts`:

```typescript
import postTemplate from './src/sanity/templates/post-template'

export default defineConfig({
  // ... existing config
  templates: [postTemplate],
})
```

**Cara dapat Author ID:**
1. Buka Sanity Studio
2. Buka author document Anda
3. Lihat URL: `http://localhost:3333/structure/author;YOUR_AUTHOR_ID`
4. Copy `YOUR_AUTHOR_ID` tersebut

---

## 🎨 Alternative: Tampilkan Author Field (Jika Butuh)

Jika suatu saat Anda ingin menampilkan author field lagi (misal ada co-author):

Edit `src/sanity/schemaTypes/post.ts`:

```typescript
defineField({
    name: 'author',
    // ...
    hidden: false, // ← Ubah dari true ke false
    // ...
}),
```

---

## 💡 Tips

### Jika Lupa Set Author
Jika Anda publish post tanpa set author, akan ada validation error. Solusi:
1. Klik "Show hidden fields"
2. Pilih author
3. Publish lagi

### Bulk Update Author
Jika Anda punya banyak post tanpa author, gunakan GROQ query di Sanity Vision:

```groq
// 1. Cek posts tanpa author
*[_type == "post" && !defined(author)]

// 2. Update semua posts (jalankan di Sanity CLI atau script)
// Ganti YOUR_AUTHOR_ID dengan ID author Anda
```

Atau buat script Node.js:

```javascript
// scripts/set-default-author.js
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  token: 'your-token', // Need write access
  apiVersion: '2024-01-01',
})

const YOUR_AUTHOR_ID = 'your-author-id-here'

async function setDefaultAuthor() {
  // Get all posts without author
  const posts = await client.fetch('*[_type == "post" && !defined(author)]')
  
  console.log(`Found ${posts.length} posts without author`)
  
  // Update each post
  for (const post of posts) {
    await client
      .patch(post._id)
      .set({
        author: {
          _type: 'reference',
          _ref: YOUR_AUTHOR_ID,
        },
      })
      .commit()
    
    console.log(`Updated post: ${post.title}`)
  }
  
  console.log('Done!')
}

setDefaultAuthor()
```

Jalankan:
```bash
node scripts/set-default-author.js
```

---

## 📊 Summary

| Aspek | Before | After |
|-------|--------|-------|
| Author Field Visibility | ✅ Visible | ✅ Hidden |
| Need to Select Author | ✅ Yes | ❌ No (auto) |
| Form Complexity | ⚠️ Medium | ✅ Simple |
| Time to Create Post | ⚠️ ~2 min | ✅ ~1 min |

---

## ❓ FAQ

**Q: Bagaimana jika saya ingin ganti author untuk post tertentu?**  
A: Klik "Show hidden fields" di tab Metadata, lalu pilih author lain.

**Q: Apakah author field masih required?**  
A: Ya, masih required. Tapi sekarang hidden untuk simplify workflow.

**Q: Bagaimana cara menampilkan author info di frontend?**  
A: Author data tetap ada di post, jadi bisa ditampilkan seperti biasa di frontend.

---

**Dibuat:** 2026-02-10  
**Project:** Jatinotes Single Author Blog
