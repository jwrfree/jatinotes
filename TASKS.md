# Task List - JatiNotes

## 🔥 Urgent (Harus Dikerjakan Sekarang)

- [x] **VERIFY**: Buka browser dan test apakah post content muncul ✅
  - URL: http://localhost:3000/posts/kenapa-buku-quiet-bikin-aku-merasa-dimengerti
  - Cek: Body content harus muncul (bukan kosong)
  
- [ ] **SEO**: Test SEO fields di Sanity Studio
  - Buka http://localhost:3000/studio
  - Edit salah satu post
  - Scroll ke "SEO Settings"
  - Isi Meta Title, Meta Description, Focus Keyword
  - Save dan cek di frontend

## ⚡ Quick Wins (15-30 menit)

- [ ] Fix reading time untuk PortableText content
  - File: `src/components/PostMeta.tsx`
  - Add function untuk extract text dari PortableText array

- [ ] Add Related Posts section
  - File: `src/app/posts/[slug]/page.tsx`
  - Data sudah ada di query, tinggal render

- [ ] Improve PortableText styling
  - File: `src/components/PortableText.tsx`
  - Better blockquote, code blocks, lists

## 🚀 High Impact (1-2 jam)

- [ ] Search functionality
  - Create search API route
  - Create search component
  - Add to navigation

- [ ] Custom PortableText blocks
  - Callout boxes
  - Video embeds
  - Better code blocks

- [ ] Image optimization
  - Lazy loading
  - Blur placeholders
  - WebP format

## 📊 Nice to Have (Optional)

- [ ] Tags support
- [ ] Newsletter subscription
- [ ] Book review template
- [ ] Analytics integration
- [ ] SEO improvements

## 🚀 Deployment

- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Setup environment variables
- [ ] Test production build

---

**Next Step**: Buka browser dan verify bahwa post content muncul! 🎯
