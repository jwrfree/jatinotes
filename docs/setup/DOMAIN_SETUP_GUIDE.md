# Panduan Setup Domain jatinotes.com ke Vercel

## Status Saat Ini
- ❌ Domain masih mengarah ke WordPress hosting lama
- ✅ Project Next.js sudah di-deploy ke Vercel
- 🎯 Target: Mengarahkan domain ke Vercel

## Langkah 1: Tambahkan Domain di Vercel Dashboard

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project **jatinotes**
3. Klik tab **Settings** → **Domains**
4. Tambahkan domain berikut:
   - `jatinotes.com` (apex domain)
   - `www.jatinotes.com` (optional, untuk redirect)

## Langkah 2: Catat DNS Records dari Vercel

Setelah menambahkan domain di Vercel, Anda akan mendapat instruksi DNS. Biasanya berupa:

### Untuk Apex Domain (jatinotes.com):
**Opsi A - Menggunakan A Records (Recommended):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Opsi B - Menggunakan CNAME dengan ANAME/ALIAS:**
```
Type: ANAME atau ALIAS
Name: @
Value: cname.vercel-dns.com
```

### Untuk WWW Subdomain (www.jatinotes.com):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Langkah 3: Update DNS di Registrar Domain

Anda perlu login ke tempat Anda membeli domain (registrar). Beberapa registrar populer:
- **Niagahoster** → Login → Domain → Manage DNS
- **Rumahweb** → Login → Domain Management → DNS Management
- **Cloudflare** → Login → Select Domain → DNS
- **Namecheap** → Login → Domain List → Manage → Advanced DNS
- **GoDaddy** → Login → My Products → Domain → DNS

### Langkah Detail:

1. **Hapus atau Nonaktifkan DNS Records Lama:**
   - Hapus semua A records yang mengarah ke WordPress hosting lama
   - Hapus CNAME records yang mengarah ke WordPress
   - **PENTING:** Jangan hapus MX records (untuk email) atau TXT records (untuk verifikasi)

2. **Tambahkan DNS Records Baru:**
   
   **Untuk jatinotes.com:**
   ```
   Type: A
   Host/Name: @ (atau kosongkan)
   Value/Points to: 76.76.21.21
   TTL: 3600 (atau Auto)
   ```

   **Untuk www.jatinotes.com:**
   ```
   Type: CNAME
   Host/Name: www
   Value/Points to: cname.vercel-dns.com
   TTL: 3600 (atau Auto)
   ```

3. **Save/Update DNS Records**

## Langkah 4: Verifikasi di Vercel

1. Kembali ke Vercel Dashboard → Settings → Domains
2. Klik **Refresh** atau tunggu beberapa saat
3. Status domain akan berubah dari "Invalid Configuration" menjadi "Valid Configuration"
4. Vercel akan otomatis generate SSL certificate (HTTPS)

## Langkah 5: Tunggu DNS Propagation

- **Waktu:** 5 menit - 48 jam (biasanya 15-30 menit)
- **Cek Status:** Gunakan tools berikut untuk cek propagation:
  - https://dnschecker.org
  - https://www.whatsmydns.net

## Troubleshooting

### Jika domain masih menampilkan WordPress setelah 24 jam:

1. **Clear DNS Cache di Komputer:**
   ```powershell
   ipconfig /flushdns
   ```

2. **Clear Browser Cache:**
   - Chrome: Ctrl + Shift + Delete
   - Atau buka Incognito/Private mode

3. **Cek DNS Records sudah benar:**
   ```powershell
   nslookup jatinotes.com
   ```
   Harusnya menunjukkan IP: `76.76.21.21`

4. **Cek di Vercel Dashboard:**
   - Pastikan status domain "Valid"
   - Pastikan SSL certificate sudah issued

### Jika menggunakan Cloudflare:

- Pastikan **Proxy Status** di-set ke **Proxied** (orange cloud)
- Atau gunakan **DNS Only** (grey cloud) untuk testing

## Checklist

- [ ] Domain ditambahkan di Vercel Dashboard
- [ ] DNS A record diupdate ke 76.76.21.21
- [ ] DNS CNAME untuk www diupdate ke cname.vercel-dns.com
- [ ] DNS records lama (WordPress) sudah dihapus
- [ ] Tunggu DNS propagation (15-30 menit)
- [ ] Clear DNS cache di komputer
- [ ] Test domain di browser (incognito mode)
- [ ] Verifikasi SSL certificate aktif (HTTPS)

## Kontak Support

Jika masih ada masalah:
- **Vercel Support:** https://vercel.com/support
- **Registrar Support:** Hubungi customer service registrar domain Anda

## Catatan Penting

⚠️ **BACKUP DULU!**
- Screenshot DNS settings lama sebelum diubah
- Backup WordPress jika masih diperlukan
- Catat IP address WordPress lama (untuk rollback jika perlu)

⚠️ **EMAIL:**
- Jangan hapus MX records jika Anda menggunakan email dengan domain ini
- Email tidak terpengaruh oleh perubahan A/CNAME records

## Setelah Domain Aktif

Setelah domain berhasil mengarah ke Vercel:

1. **Update Environment Variables di Vercel:**
   - Pastikan `NEXT_PUBLIC_SITE_URL=https://jatinotes.com`
   - Redeploy jika perlu

2. **Setup Redirects:**
   - Redirect www → non-www (atau sebaliknya)
   - Sudah otomatis di-handle Vercel

3. **SEO:**
   - Submit sitemap ke Google Search Console
   - Update Google Analytics (jika ada)
   - Verifikasi domain di Google Search Console

---

**Dibuat:** 2026-02-10
**Project:** Jatinotes Next.js Migration
