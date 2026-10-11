# Portal Tugas Kuliah — TugasNaila

Aplikasi web modern, responsif, dan elegan untuk portal tugas kuliah mahasiswa atas nama **Naila Ramadhani** (NIM: `1247050026` • Kelas: `C`).

Dilengkapi sistem autentikasi **Admin Login**, modal formulir **Tambah Tugas**, tombol **Hapus Tugas** langsung, filter status dinamis, dan penyimpanan otomatis berbasis **Local Storage** yang siap di-deploy ke platform mana pun.

---

## Fitur Utama

1. **Kondisi Pengunjung (Belum Login):**
   - **Navbar / Header:** Logo & teks `TugasNaila` di kiri dan tombol kapsul `Admin Login` di kanan.
   - **Card Profile / Biodata:** Avatar huruf `N` gradien modern, teks nama `Naila Ramadhani`, dan sub-teks `NIM: 1247050026 • Kelas: C`.
   - **Filter Pills:** Tombol filter kapsul `Semua`, `Selesai`, dan `Belum` dilengkapi indikator jumlah tugas secara langsung.
   - **Kartu Tugas:** Tampilan kartu rapi dengan label pertemuan, status badge, judul, deskripsi, metode pengumpulan, dan tombol utama `Buka Tugas ↗`.
   - **Empty State:** Kondisi visual saat belum ada tugas atau saat hasil filter kosong.

2. **Halaman / Modal Login Admin:**
   - Ikon gembok (*lock icon*) di bagian atas kartu terpusat `Masuk Admin`.
   - Field password dengan border biru halus dan tombol *toggle* intip kata sandi.
   - Tombol utama biru `Login Sekarang`.
   - Navigasi link `← Kembali ke Halaman Utama`.
   - **Password Default Admin:** `admin123`.

3. **Kondisi Setelah Admin Login:**
   - **Navbar Admin:** Tombol `Admin Login` berubah menjadi 2 tombol kapsul di pojok kanan:
     - `+ Tambah Tugas` (warna biru)
     - `Logout` (warna merah muda/soft)
   - **Badge Mode Admin:** Indikator hijau aktif pada kartu biodata profil.
   - **Aksi pada Kartu Tugas:** Di samping tombol `Buka Tugas ↗`, terdapat tombol kotak merah muda/soft dengan ikon tempat sampah merah untuk menghapus tugas secara langsung (disertai modal konfirmasi aman).

4. **Modal / Formulir Tambah Tugas:**
   - Header terpusat `Tambah Tugas` dengan sub-teks `Isi data tugas baru di bawah ini.`.
   - Field yang tersedia:
     - Pertemuan Ke- (Contoh: `1`)
     - Judul Tugas (Contoh: `Membuat Website`)
     - Deskripsi Singkat (Textarea)
     - Status (`Belum Dikerjakan` / `Selesai`)
     - Pilih Metode Pengumpulan (`Kirim Link (Google Drive / Web)`)
     - Link Tugas (`https://...`)
   - Tombol `Batal` (soft) dan `Simpan Tugas` (biru tua).

5. **Ketentuan Visual & Responsivitas:**
   - **Tanpa Maskot Poyoyo:** Bersih dari elemen ilustrasi Poyoyo di pojok mana pun.
   - **Responsif:** Tampilan otomatis pas di layar HP (Mobile), Tablet, maupun Laptop/Desktop.
   - **Footer:** Teks terpusat `© 2026 Portal Tugas — Naila Ramadhani`.
   - **Animasi & Toast:** Feedback instan notifikasi toast saat login, simpan tugas, hapus tugas, dan logout.

---

## Struktur Berkas

```
├── index.html        # Struktur HTML5 semantik dan accessible dialog modals
├── styles.css        # Desain Vanilla CSS modern, responsif, dan glassmorphism
├── app.js            # Logika JavaScript: LocalStorage, Auth, CRUD, Filter
└── README.md         # Dokumentasi & panduan deployment
```

---

## Panduan Menjalankan Secara Lokal

### Cara 1: Menggunakan Script Server Bawaan (Direkomendasikan)
Cukup jalankan perintah Node.js langsung di terminal:
```bash
node server.js
```
Lalu buka browser di: `http://localhost:3000`

### Cara 2: Menggunakan npx.cmd (Jika npx diblokir oleh PowerShell)
```bash
npx.cmd serve .
```

### Cara 3: Langsung Buka Berkas
Anda juga bisa langsung klik dua kali berkas `index.html` dari File Explorer di Windows.

---

## Panduan Deployment ke Berbagai Platform

Aplikasi ini menggunakan murni **HTML, CSS, dan JavaScript murni (Vanilla)** tanpa build step sehingga dapat di-deploy dalam hitungan detik:

### 1. Vercel
1. Upload folder proyek ke GitHub atau jalankan perintah:
   ```bash
   npx vercel
   ```
2. Pilih default settings. Proyek akan langsung live dengan URL `https://...vercel.app`.

### 2. Netlify
1. Buka [Netlify Drop](https://app.netlify.com/drop).
2. Tarik (*drag and drop*) seluruh folder proyek ke halaman Netlify.
3. Website akan langsung aktif dalam hitungan detik.

### 3. GitHub Pages
1. Push repository ke GitHub.
2. Buka menu **Settings** > **Pages** di repositori GitHub Anda.
3. Pada bagian **Branch**, pilih `main` / `master` dan folder `/ (root)`, lalu klik **Save**.
4. Website akan aktif di `https://username.github.io/repository-name/`.

---

&copy; 2026 Portal Tugas — Naila Ramadhani
