# Implementation Plan - JatiNotes Enhancement

**Dibuat**: 2026-02-09  
**Status**: Ready to Execute

## 🎯 Tujuan

Meningkatkan performa, UX, dan fitur dari JatiNotes setelah migrasi ke Sanity berhasil.

---

## Phase 1: Verification & Testing ✅

### Task 1.1: Manual Testing
- [ ] Buka http://localhost:3000 di browser
- [ ] Verifikasi home page menampilkan posts
- [ ] Klik salah satu post dan verifikasi:
  - [ ] Title muncul
  - [ ] Featured image muncul
  - [ ] **Body content muncul** (PortableText)
  - [ ] TOC muncul di sidebar (desktop)
  - [ ] Author info muncul
  - [ ] Categories muncul
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test dark mode

### Task 1.2: Performance Check
- [ ] Cek Lighthouse score
- [ ] Cek loading time
- [ ] Cek image optimization
- [ ] Cek bundle size

**Estimasi**: 30 menit  
**Priority**: HIGH

---

## Phase 2: Bug Fixes & Improvements 🔧

### Task 2.1: Fix Reading Time untuk PortableText
**File**: `src/components/PostMeta.tsx`

**Issue**: Reading time tidak dihitung untuk PortableText content

**Solution**:
```typescript
// Add helper function to extract text from PortableText
function extractTextFromPortableText(blocks: any[]): string {
  return blocks
    .filter(block => block._type === 'block')
    .map(block => 
      block.children
        ?.map((child: any) => child.text)
        .join('') || ''
    )
    .join(' ');
}

// Update PostMeta to handle both string and array content
const text = typeof content === 'string' 
  ? content 
  : extractTextFromPortableText(content || []);
```

**Estimasi**: 15 menit  
**Priority**: MEDIUM

---

### Task 2.2: Improve PortableText Styling
**File**: `src/components/PortableText.tsx`

**Improvements**:
1. Add code block syntax highlighting
2. Add better blockquote styling
3. Add custom list styling
4. Add table support (if needed)

**Estimasi**: 30 menit  
**Priority**: MEDIUM

---

### Task 2.3: Add Loading States
**Files**: 
- `src/app/posts/[slug]/page.tsx`
- `src/app/page.tsx`

**Add**:
- Skeleton loaders for posts
- Loading states for images
- Suspense boundaries

**Estimasi**: 45 menit  
**Priority**: LOW

---

## Phase 3: Performance Optimization ⚡

### Task 3.1: Implement ISR (Incremental Static Regeneration)
**File**: `src/app/posts/[slug]/page.tsx`

**Current**: `export const revalidate = 60;` ✅ Already implemented!

**Verify**: Check if revalidation works correctly

**Estimasi**: 10 menit  
**Priority**: LOW

---

### Task 3.2: Optimize Images
**Files**: 
- `src/components/PortableText.tsx`
- `src/components/ImageZoom.tsx`

**Add**:
- Lazy loading
- Blur placeholder
- Responsive sizes
- WebP format

**Estimasi**: 30 menit  
**Priority**: MEDIUM

---

### Task 3.3: Add Caching Strategy
**Files**: 
- `src/lib/repositories/*.ts`

**Current**: Using React `cache()` ✅

**Verify**: Check if caching works correctly

**Estimasi**: 10 menit  
**Priority**: LOW

---

## Phase 4: New Features 🚀

### Task 4.1: Search Functionality
**Files**: 
- `src/app/api/search/route.ts` (create)
- `src/components/SearchBar.tsx` (create)
- `src/lib/repositories/post.repository.ts` (update)

**Features**:
- Full-text search in title and body
- Search suggestions
- Search results page

**Estimasi**: 2 hours  
**Priority**: MEDIUM

---

### Task 4.2: Related Posts
**File**: `src/app/posts/[slug]/page.tsx`

**Current**: Query already includes related posts! ✅

**Add**:
- Related posts section at bottom of post
- Card component for related posts
- "You might also like" heading

**Estimasi**: 30 menit  
**Priority**: MEDIUM

---

### Task 4.3: Tags Support
**Files**: 
- `src/sanity/schemaTypes/tag.ts` (create)
- `src/sanity/schemaTypes/post.ts` (update)
- `src/app/tags/[slug]/page.tsx` (create)

**Features**:
- Tag schema in Sanity
- Tag display on posts
- Tag archive page

**Estimasi**: 1.5 hours  
**Priority**: LOW

---

### Task 4.4: Newsletter Subscription
**Files**: 
- `src/components/NewsletterForm.tsx` (create)
- `src/app/api/subscribe/route.ts` (create)

**Integration**: Mailchimp / ConvertKit / Resend

**Estimasi**: 1 hour  
**Priority**: LOW

---

## Phase 5: Content Enhancement 📝

### Task 5.1: Custom PortableText Blocks
**Files**: 
- `src/sanity/schemaTypes/customBlocks/` (create folder)
- `src/components/PortableText.tsx` (update)

**Custom Blocks**:
1. **Callout Block** - Highlighted info boxes
2. **Video Embed** - YouTube/Vimeo embeds
3. **Code Block** - Syntax highlighted code
4. **Quote Block** - Beautiful quote cards
5. **Button Block** - CTA buttons

**Estimasi**: 2 hours  
**Priority**: MEDIUM

---

### Task 5.2: Book Review Template
**Files**: 
- `src/sanity/schemaTypes/bookReview.ts` (create)
- `src/components/BookReviewCard.tsx` (create)

**Fields**:
- Book title, author, ISBN
- Rating (1-5 stars)
- Goodreads link
- Purchase links
- Review content

**Estimasi**: 1.5 hours  
**Priority**: LOW

---

## Phase 6: SEO & Analytics 📊

### Task 6.1: Improve SEO
**Files**: 
- `src/lib/metadata.ts`
- `src/app/posts/[slug]/page.tsx`

**Improvements**:
- Add breadcrumbs
- Add FAQ schema
- Add article schema
- Improve meta descriptions

**Estimasi**: 45 menit  
**Priority**: MEDIUM

---

### Task 6.2: Add Analytics
**Files**: 
- `src/app/layout.tsx`
- `src/components/Analytics.tsx` (create)

**Integration**: Google Analytics / Plausible / Umami

**Estimasi**: 30 menit  
**Priority**: LOW

---

## Phase 7: Deployment & Monitoring 🚀

### Task 7.1: Deploy to Vercel
**Steps**:
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

**Estimasi**: 20 menit  
**Priority**: HIGH

---

### Task 7.2: Setup Monitoring
**Tools**:
- Vercel Analytics
- Sentry for error tracking
- Uptime monitoring

**Estimasi**: 30 menit  
**Priority**: MEDIUM

---

## 📊 Summary

| Phase | Tasks | Estimasi Total | Priority |
|-------|-------|----------------|----------|
| Phase 1 | 2 | 30 min | HIGH |
| Phase 2 | 3 | 1.5 hours | MEDIUM |
| Phase 3 | 3 | 50 min | MEDIUM |
| Phase 4 | 4 | 5 hours | MEDIUM |
| Phase 5 | 2 | 3.5 hours | MEDIUM |
| Phase 6 | 2 | 1.25 hours | MEDIUM |
| Phase 7 | 2 | 50 min | HIGH |

**Total Estimasi**: ~13 hours

---

## 🎯 Recommended Order

1. **Phase 1** - Verification (30 min) ⭐ START HERE
2. **Phase 2.1** - Fix Reading Time (15 min)
3. **Phase 4.2** - Related Posts (30 min)
4. **Phase 2.2** - Improve PortableText (30 min)
5. **Phase 3.2** - Optimize Images (30 min)
6. **Phase 7.1** - Deploy to Vercel (20 min)
7. **Phase 4.1** - Search (2 hours)
8. **Phase 5.1** - Custom Blocks (2 hours)
9. **Remaining tasks** - As needed

---

## 📝 Notes

- Semua task bersifat optional kecuali Phase 1 (Verification)
- Priority HIGH harus dikerjakan terlebih dahulu
- Estimasi waktu adalah perkiraan, bisa lebih cepat atau lambat
- Setiap task bisa dikerjakan secara independen

---

**Next Action**: Mulai dengan Phase 1 - Manual Testing untuk memverifikasi bahwa migrasi benar-benar berhasil!
