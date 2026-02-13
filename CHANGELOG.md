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
- **Experience (UX)**:
  - **Sticky Audio Player**: Penambahan pemutar audio yang melayang (*sticky*) di bagian bawah halaman dengan efek *glassmorphism* premium.
  - **Auto-Hide**: Player sticky hanya muncul ketika audio aktif dan user telah scroll melewati konten.
  - **Scroll To Top**: Redesain tombol dengan estetika *frosted glass* yang selaras dengan sticky player.
- **Accessibility**:
  - Peningkatan kontras teks pada Navbar Logo (Notes: amber-600) untuk keterbacaan lebih baik.
  - Optimasi kontras tipografi artikel (Prose text-zinc-800).

### Perbaikan
- Bug hydration pada komponen UI (nested buttons).
- Pembersihan metadata yang sudah deprecated.
- Sinkronisasi slug artikel lama untuk menjaga integritas link (SEO).