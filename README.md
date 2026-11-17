# ADB CREATIVE TEAM — Website Portofolio Resmi

Website portofolio ekstrakurikuler **ADB CREATIVE TEAM** dengan dashboard admin dan database sungguhan.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres, Auth, Storage, RLS) · Lucide React · Framer Motion

---

## Fitur

**Website publik** — Home, About, Activities (pencarian + filter kategori, halaman detail), Projects (filter + dialog detail), Gallery (masonry, filter kegiatan & jenis media, lightbox foto/video), Achievements (filter tingkat), Contact. Semua data dibaca langsung dari Supabase, lengkap dengan loading, error, dan empty state.

**Dashboard admin** (`/admin`) — login Supabase Auth, statistik, CRUD kegiatan / proyek / galeri / prestasi / anggota / kategori, upload foto, video, dan dokumen ke Supabase Storage (galeri mendukung upload banyak file sekaligus), serta pengaturan profil ekskul. Konten di-render dinamis, jadi perubahan admin langsung tampil di website publik.

**Keamanan** — Row Level Security di semua tabel: pengunjung hanya bisa membaca; hanya user yang terdaftar di tabel `admins` yang dapat menambah/mengubah/menghapus data dan file. Hanya `anon key` (publik by design) yang dipakai di frontend. **Service role key tidak digunakan sama sekali.**

---

## Instalasi (±10 menit)

### 1. Buat project Supabase
1. Daftar/login di <https://supabase.com> → **New project**.
2. Setelah project siap, buka **Project Settings → API**. Salin **Project URL** dan **anon public key**.

### 2. Jalankan SQL
Buka **SQL Editor** di dashboard Supabase, lalu jalankan berurutan:
1. Isi `supabase/schema.sql` — membuat tabel, RLS, bucket storage `media`, dan policy.
2. *(Opsional)* Isi `supabase/seed.sql` — mengisi profil, kategori, dan beberapa data placeholder yang bisa diedit/dihapus dari dashboard.

### 3. Buat akun admin
1. Dashboard Supabase → **Authentication → Users → Add user → Create new user**. Isi email + password, centang *Auto Confirm User*.
2. *(Disarankan)* **Authentication → Providers → Email**: matikan *Allow new users to sign up* agar tidak ada yang bisa mendaftar sendiri.

### 4. Daftarkan akun itu sebagai admin
Di **SQL Editor**, jalankan (ganti emailnya):

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'email-admin@contoh.com';
```

Akun yang tidak ada di tabel `admins` tidak bisa mengubah apa pun, walaupun berhasil login. Ulangi query ini untuk menambah admin lain.

### 5. Konfigurasi environment
```bash
cp .env.example .env.local
```
Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 6. Jalankan
```bash
npm install
npm run dev
```
- Website: <http://localhost:3000>
- Admin: <http://localhost:3000/admin> (tautan "Admin Login" juga ada di footer)

### 7. Deploy (opsional, Vercel)
Push ke GitHub → import di <https://vercel.com> → tambahkan dua environment variable di atas → Deploy.

---

## Cara pakai singkat

| Tugas | Lokasi di dashboard |
|---|---|
| Ubah nama, sejarah, visi-misi, tujuan, kontak, sosmed, foto hero | **Profil Ekskul** |
| Tambah kategori untuk filter | **Kategori** (pilih "Kegiatan" atau "Proyek") |
| Tambah kegiatan + foto sampul + video | **Kegiatan** |
| Unggah foto/video dokumentasi (banyak sekaligus) | **Galeri**, kaitkan ke kegiatan agar bisa difilter |
| Tampilkan proyek di beranda | **Proyek** → centang *Featured* |
| Struktur kepengurusan | **Anggota** (isi *Divisi* & *Urutan tampil*) |

Catatan:
- Teks **Misi** dan **Tujuan** diisi **satu poin per baris**.
- Video bisa berupa file (maks. **50 MB**, batas paket Free Supabase) atau **link YouTube** (disarankan untuk video panjang).
- Saat data dihapus atau file diganti, file lama di Storage ikut dibersihkan otomatis.

---

## Struktur proyek

```
supabase/
  schema.sql            Tabel, RLS, storage bucket + policy
  seed.sql              Data awal opsional
src/
  middleware.ts         Proteksi /admin/* (wajib login)
  types/                Tipe data
  lib/
    supabase/           Client browser & server (cookie session)
    data.ts             Query data publik (server)
    admin-config.ts     Definisi field CRUD tiap tabel (config-driven)
    storage.ts          Upload & hapus file Storage
    constants.ts, utils.ts
  components/           Komponen reusable (Navbar, Hero, cards, Lightbox, Explorer…)
    admin/              ResourceManager (CRUD generik), form, upload, sidebar
  app/
    (site)/             Halaman publik (+ layout, loading, error)
    admin/login         Halaman login admin
    admin/(panel)/      Dashboard, CRUD [resource], Profil Ekskul
```

Menambah kolom/tabel baru: tambahkan di `schema.sql`, lalu daftarkan field-nya di `src/lib/admin-config.ts` — form, daftar, pencarian, dan upload dashboard menyesuaikan otomatis.

## Catatan desain data
- `profiles` berisi **satu baris** (id = 1) untuk informasi profil ekskul.
- `admins` (tabel tambahan) menentukan siapa yang berhak mengelola konten; dipakai oleh fungsi `is_admin()` di semua policy RLS.
- Form di halaman Contact membuka aplikasi email pengunjung dengan pesan terisi (tanpa server tambahan). Bila ingin pesan tersimpan di database, tambahkan tabel `messages` dengan policy insert publik.

## Pemecahan masalah
- **"Variabel NEXT_PUBLIC_SUPABASE_URL … belum diisi"** → buat `.env.local`, lalu restart `npm run dev`.
- **"Akses ditolak / row-level security"** → akun belum dimasukkan ke tabel `admins` (langkah 4).
- **Upload gagal** → pastikan `schema.sql` sudah dijalankan penuh (bucket `media` + policy) dan ukuran file ≤ 50 MB.
- **Tabel tidak ditemukan** → `schema.sql` belum dijalankan di project Supabase yang sama dengan URL di `.env.local`.
