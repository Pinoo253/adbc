-- =====================================================================
-- ADB CREATIVE TEAM — Skema database Supabase
-- Jalankan seluruh file ini di Supabase Dashboard -> SQL Editor.
-- Aman dijalankan berulang kali (idempotent).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. Admin & fungsi otorisasi
-- ---------------------------------------------------------------------
-- Hanya user yang ada di tabel ini yang boleh mengubah konten.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- 2. Tabel konten
-- ---------------------------------------------------------------------

-- Profil ekskul (satu baris saja, id = 1)
create table if not exists public.profiles (
  id             int primary key default 1 check (id = 1),
  name           text not null default 'ADB CREATIVE TEAM',
  tagline        text,
  description    text,
  history        text,
  vision         text,
  mission        text,   -- satu poin per baris
  goals          text,   -- satu poin per baris
  email          text,
  phone          text,
  address        text,
  instagram      text,
  youtube        text,
  tiktok         text,
  hero_image_url text,
  updated_at     timestamptz not null default now()
);

create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       text not null check (type in ('activity', 'project')),
  created_at timestamptz not null default now(),
  unique (name, type)
);

create table if not exists public.activities (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  date        date not null default current_date,
  location    text,
  category_id uuid references public.categories(id) on delete set null,
  description text,
  cover_url   text,
  video_url   text,
  created_at  timestamptz not null default now()
);

create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  creator      text not null,
  published_at date not null default current_date,
  category_id  uuid references public.categories(id) on delete set null,
  image_url    text,
  video_url    text,
  link_url     text,
  is_featured  boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.gallery (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  media_type  text not null default 'image' check (media_type in ('image', 'video')),
  url         text not null,
  activity_id uuid references public.activities(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table if not exists public.achievements (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  competition     text not null,
  level           text not null,
  date            date not null default current_date,
  description     text,
  image_url       text,
  certificate_url text,
  created_at      timestamptz not null default now()
);

create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text not null,
  division   text,
  bio        text,
  photo_url  text,
  instagram  text,
  sort_order int not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists activities_date_idx   on public.activities (date desc);
create index if not exists projects_pub_idx      on public.projects (published_at desc);
create index if not exists gallery_activity_idx  on public.gallery (activity_id);
create index if not exists achievements_date_idx on public.achievements (date desc);

-- updated_at otomatis untuk profiles
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

insert into public.profiles (id, name, tagline)
values (1, 'ADB CREATIVE TEAM', 'Creative Community & Digital Documentation')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 3. Row Level Security
--    Pengunjung: hanya membaca. Admin: tambah / ubah / hapus.
-- ---------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'categories', 'activities', 'projects',
    'gallery', 'achievements', 'team_members'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "public read"  on public.%I', t);
    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format('drop policy if exists "admin delete" on public.%I', t);

    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check (public.is_admin())', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;

-- Tabel admins: user hanya boleh melihat barisnya sendiri.
-- Penambahan admin dilakukan lewat SQL Editor (lihat README).
alter table public.admins enable row level security;
drop policy if exists "read own admin row" on public.admins;
create policy "read own admin row" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 4. Storage (foto, video, dokumen)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 52428800,  -- 50 MB (batas paket Free Supabase)
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
    'video/mp4', 'video/webm', 'video/quicktime',
    'application/pdf'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media public read"  on storage.objects;
drop policy if exists "media admin insert" on storage.objects;
drop policy if exists "media admin update" on storage.objects;
drop policy if exists "media admin delete" on storage.objects;

create policy "media public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');
create policy "media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
