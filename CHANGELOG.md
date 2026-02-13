# Changelog

Semua perubahan signifikan pada proyek **Jatinotes (Wruhantojati)** akan didokumentasikan di file ini.

## [1.0.0] - 2026-02-13
### Ditambahkan (Released!)
- **Official Launch**: Jatinotes resmi mengudara di `jatinotes.com`.
- **Branding**: Implementasi identitas **Wruhantojati** yang konsisten di seluruh platform.
- **Design System**: 
  - Estetika premium dengan *glassmorphism*.
  - Token desain adaptif: Desktop (8px radius, sharp shadows) vs Mobile (soft UI).
- **SEO & Search**: 
  - JSON-LD Structured Data untuk entitas `Person` dan `Website`.
  - Integrasi metadata dinamis untuk Blog dan Buku.
- **Content Engine**: Migrasi penuh dari WordPress ke Sanity CMS dengan dukungan *Portable Text* dan *Image Zoom*.
- **Infrastructure**: Deployment stabil di Vercel dengan optimasi performa Next.js 14+.

### Perbaikan
- Bug hydration pada komponen UI (nested buttons).
- Pembersihan metadata yang sudah deprecated.
- Sinkronisasi slug artikel lama untuk menjaga integritas link (SEO).
