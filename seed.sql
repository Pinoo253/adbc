-- =====================================================================
-- ADB CREATIVE TEAM — Data awal (OPSIONAL)
-- Jalankan SETELAH schema.sql. Semua isi hanyalah placeholder yang
-- bisa diedit / dihapus dari dashboard admin.
-- =====================================================================

update public.profiles set
  tagline     = 'Creative Community & Digital Documentation',
  description = 'ADB CREATIVE TEAM adalah komunitas ekstrakurikuler yang menjadi rumah bagi siswa kreatif: fotografer, videografer, desainer, dan content creator yang mendokumentasikan setiap momen sekolah dan menuangkannya menjadi karya digital.',
  history     = 'ADB CREATIVE TEAM dibentuk dari kebutuhan sekolah akan dokumentasi kegiatan yang berkualitas. Berawal dari sekelompok kecil siswa yang gemar fotografi dan desain, kini ADB CREATIVE TEAM tumbuh menjadi komunitas dengan beragam bidang kreatif. (Ganti dengan sejarah asli ekskul.)',
  vision      = 'Menjadi komunitas kreatif siswa yang inspiratif, profesional, dan berdaya saing dalam dokumentasi serta karya digital.',
  mission     = E'Mendokumentasikan seluruh kegiatan sekolah secara kreatif dan profesional.\nMengembangkan keterampilan desain, fotografi, dan videografi anggota.\nMenjadi wadah kolaborasi dan ekspresi siswa.\nMengikuti dan meraih prestasi di berbagai kompetisi kreatif.',
  goals       = E'Melatih kemampuan teknis dan kreativitas anggota.\nMenyediakan arsip digital kegiatan sekolah.\nMembangun portofolio karya anggota sejak dini.\nMenumbuhkan jiwa kepemimpinan dan kerja sama tim.',
  email       = 'halo@adbcreativeteam.id',
  phone       = '+62 800-0000-0000',
  address     = 'Ruang Ekstrakurikuler ADB, Jl. Pendidikan No. 1',
  instagram   = 'https://instagram.com/adbcreativeteam',
  youtube     = 'https://youtube.com/@adbcreativeteam',
  tiktok      = 'https://tiktok.com/@adbcreativeteam'
where id = 1;

insert into public.categories (name, type) values
  ('Dokumentasi Event', 'activity'),
  ('Workshop',          'activity'),
  ('Pelatihan',         'activity'),
  ('Kompetisi',         'activity'),
  ('Kunjungan',         'activity'),
  ('Desain Grafis',     'project'),
  ('Fotografi',         'project'),
  ('Videografi',        'project'),
  ('Editing Video',     'project'),
  ('Konten Digital',    'project')
on conflict (name, type) do nothing;

insert into public.activities (title, date, location, category_id, description)
select v.title, v.date::date, v.location,
       (select id from public.categories where name = v.cat and type = 'activity'),
       v.description
from (values
  ('Workshop Dasar Fotografi', '2026-08-12', 'Aula Sekolah', 'Workshop',
   'Pengenalan komposisi, pencahayaan, dan pengaturan kamera untuk anggota baru. (Placeholder — edit dari dashboard.)'),
  ('Dokumentasi Upacara & Pentas Seni', '2026-09-20', 'Lapangan Utama', 'Dokumentasi Event',
   'Tim dokumentasi meliput rangkaian pentas seni sekolah dari persiapan hingga penutupan. (Placeholder.)'),
  ('Pelatihan Editing Video', '2026-10-05', 'Lab Multimedia', 'Pelatihan',
   'Belajar alur kerja editing video: cutting, color grading, hingga export. (Placeholder.)')
) as v(title, date, location, cat, description)
where not exists (select 1 from public.activities);

insert into public.projects (title, description, creator, published_at, category_id, is_featured)
select v.title, v.description, v.creator, v.pub::date,
       (select id from public.categories where name = v.cat and type = 'project'),
       v.featured
from (values
  ('Poster Pentas Seni 2026', 'Desain poster resmi untuk acara pentas seni tahunan. (Placeholder.)', 'Nama Anggota', '2026-09-01', 'Desain Grafis', true),
  ('Seri Foto: Wajah Sekolah', 'Rangkaian potret candid kegiatan belajar sehari-hari. (Placeholder.)', 'Nama Anggota', '2026-09-15', 'Fotografi', true),
  ('Aftermovie Pentas Seni', 'Video rekap acara pentas seni berdurasi 3 menit. (Placeholder.)', 'Nama Anggota', '2026-10-01', 'Videografi', true)
) as v(title, description, creator, pub, cat, featured)
where not exists (select 1 from public.projects);

insert into public.achievements (title, competition, level, date, description)
select * from (values
  ('Juara 2 Desain Poster', 'Lomba Kreativitas Pelajar', 'Kabupaten/Kota', '2026-05-10'::date,
   'Karya poster anggota meraih juara 2 tingkat kabupaten/kota. (Placeholder.)'),
  ('Juara Harapan 1 Film Pendek', 'Festival Film Pelajar', 'Provinsi', '2026-07-22'::date,
   'Tim videografi mengirimkan film pendek dan meraih juara harapan. (Placeholder.)')
) as v(title, competition, level, date, description)
where not exists (select 1 from public.achievements);

insert into public.team_members (name, role, division, sort_order)
select * from (values
  ('Nama Pembina',  'Pembina Ekskul',     'Pembina',     1),
  ('Nama Ketua',    'Ketua',              'Inti',        2),
  ('Nama Wakil',    'Wakil Ketua',        'Inti',        3),
  ('Nama Sekretaris','Sekretaris',        'Inti',        4),
  ('Nama Anggota A','Koordinator Foto',   'Fotografi',   5),
  ('Nama Anggota B','Koordinator Video',  'Videografi',  6),
  ('Nama Anggota C','Koordinator Desain', 'Desain',      7)
) as v(name, role, division, sort_order)
where not exists (select 1 from public.team_members);
