# Wruhantojati (JatiNotes) 🖋️

> "Sebuah rumah digital untuk catatan teknologi yang teknis dan cerita hidup yang jujur."

JatiNotes adalah platform personal branding dan dokumentasi pengetahuan milik **Wruhantojati**. Situs ini bukan sekadar blog, melainkan sebuah artefak digital yang dibangun dengan fokus pada estetika minimalis, performa tinggi, dan struktur data yang solid.

## 🎭 Karakter Konten
Situs ini membagi dua spektrum pemikiran:
- **Blog (Personal)**: Bergaya *Storytelling* & Jujur. Tempat untuk refleksi diri, opini, dan perjalanan personal yang ditulis secara naratif.
- **Buku & Teknologi (Proyek)**: Eksplorasi yang **Teknis & Terstruktur**. Dokumentasi mendalam tentang software engineering, arsitektur sistem, dan resolusi masalah teknis.

## 🛠️ Tech Stack & Design System
Dibangun dengan standar modern untuk memberikan pengalaman membaca yang premium:
- **Frontend Engine**: [Next.js 14+](https://nextjs.org/) (App Router) & TypeScript.
- **Content Engine**: Hybrid [Sanity.io](https://www.sanity.io/) (Headless CMS) untuk fleksibilitas konten modern dengan dukungan migrasi data historis dari WordPress.
- **Design Philosophy**: 
    - **Premium Aesthetics**: Menggunakan sistem token desain yang presisi—radius kartu 8px dan bayangan tajam (*sharp shadows*) untuk tampilan profesional dan berwibawa (*enterprise-grade look*).
    - **Dynamic Interaction**: Integrasi Framer Motion untuk mikro-animasi halus dan efek *glassmorphism*.
    - **Adaptive Layout**: UI yang cerdas beradaptasi antara kenyamanan sentuhan (*touch-friendly*) di mobile dan ketajaman informasi di desktop.
- **SEO & Identity**: Integrasi JSON-LD Structured Data yang ketat untuk memastikan entitas `Person` (**Wruhantojati**) dan `Website` dikenali secara akurat oleh mesin pencari.

## 🚀 Persiapan Lokal

1.  **Clone Repository**
    ```bash
    git clone https://github.com/jwrfree/jatinotes.git
    cd jatinotes
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Buat file `.env.local` dan isi dengan konfigurasi dari Sanity Project.

4.  **Jalankan Server Development**
    ```bash
    npm run dev
    ```
    Buka [localhost:3000](http://localhost:3000) untuk melihat situs, atau [/studio](http://localhost:3000/studio) untuk mengelola konten.

## 📜 Lisensi
Situs ini bersifat personal. Kode tersedia di bawah lisensi [MIT](LICENSE). Konten dan tulisan merupakan hak cipta intelektual dari **Wruhantojati**.
