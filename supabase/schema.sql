-- ============================================
-- MASJID AL-IKHLAS - SUPABASE SCHEMA + RLS
-- ============================================

create extension if not exists pgcrypto;

-- ============================================
-- TABLES
-- ============================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  address text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  notifications_enabled boolean not null default true,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.slides (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  cta_label text,
  cta_link text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null default 'umum',
  is_pinned boolean not null default false,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text not null,
  description text not null,
  image_url text,
  status text not null default 'baru' check (status in ('baru', 'diproses', 'selesai')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  expo_push_token text not null unique,
  device_name text,
  platform text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mosque_settings (
  id uuid primary key default gen_random_uuid(),
  mosque_name text not null default 'Masjid Al-Ikhlas',
  address text,
  latitude double precision not null default -6.232265758662486,
  longitude double precision not null default 107.09997895210284,
  city_name text not null default 'KOTA BEKASI',
  province_name text not null default 'JAWA BARAT',
  about text,
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  target_scope text not null default 'admins',
  data jsonb,
  sent_at timestamptz not null default now()
);

-- ============================================
-- DEFAULT DATA
-- ============================================

insert into public.mosque_settings (mosque_name, address, latitude, longitude, city_name, province_name, about)
select
  'Masjid Al-Ikhlas',
  'Koordinat lokasi masjid',
  -6.232265758662486,
  107.09997895210284,
  'KOTA BEKASI',
  'JAWA BARAT',
  'Masjid Al-Ikhlas adalah pusat ibadah, dakwah, dan pelayanan jamaah.'
where not exists (select 1 from public.mosque_settings);

-- ============================================
-- FUNCTIONS
-- ============================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================
-- TRIGGERS
-- ============================================

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_slides_updated_at on public.slides;
create trigger set_slides_updated_at
  before update on public.slides
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_announcements_updated_at on public.announcements;
create trigger set_announcements_updated_at
  before update on public.announcements
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_reports_updated_at on public.reports;
create trigger set_reports_updated_at
  before update on public.reports
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_push_tokens_updated_at on public.push_tokens;
create trigger set_push_tokens_updated_at
  before update on public.push_tokens
  for each row execute procedure public.set_updated_at();

-- ============================================
-- STORAGE BUCKETS
-- ============================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('slides', 'slides', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('report-images', 'report-images', true)
on conflict (id) do nothing;

-- ============================================
-- ENABLE RLS
-- ============================================

alter table public.profiles enable row level security;
alter table public.slides enable row level security;
alter table public.announcements enable row level security;
alter table public.reports enable row level security;
alter table public.push_tokens enable row level security;
alter table public.mosque_settings enable row level security;
alter table public.notification_logs enable row level security;

-- ============================================
-- RLS POLICIES - PROFILES
-- ============================================

drop policy if exists "profiles select self or admin" on public.profiles;
create policy "profiles select self or admin"
on public.profiles
for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles update self or admin" on public.profiles;
create policy "profiles update self or admin"
on public.profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles insert self or admin" on public.profiles;
create policy "profiles insert self or admin"
on public.profiles
for insert
with check (auth.uid() = id or public.is_admin());

-- ============================================
-- RLS POLICIES - SLIDES
-- ============================================

drop policy if exists "slides public read" on public.slides;
create policy "slides public read"
on public.slides
for select
using (is_active = true or public.is_admin());

drop policy if exists "slides admin insert" on public.slides;
create policy "slides admin insert"
on public.slides
for insert
with check (public.is_admin());

drop policy if exists "slides admin update" on public.slides;
create policy "slides admin update"
on public.slides
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "slides admin delete" on public.slides;
create policy "slides admin delete"
on public.slides
for delete
using (public.is_admin());

-- ============================================
-- RLS POLICIES - ANNOUNCEMENTS
-- ============================================

drop policy if exists "announcements public read" on public.announcements;
create policy "announcements public read"
on public.announcements
for select
using (is_active = true or public.is_admin());

drop policy if exists "announcements admin insert" on public.announcements;
create policy "announcements admin insert"
on public.announcements
for insert
with check (public.is_admin());

drop policy if exists "announcements admin update" on public.announcements;
create policy "announcements admin update"
on public.announcements
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "announcements admin delete" on public.announcements;
create policy "announcements admin delete"
on public.announcements
for delete
using (public.is_admin());

-- ============================================
-- RLS POLICIES - REPORTS
-- ============================================

drop policy if exists "reports own read or admin" on public.reports;
create policy "reports own read or admin"
on public.reports
for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "reports own insert" on public.reports;
create policy "reports own insert"
on public.reports
for insert
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "reports own update or admin" on public.reports;
create policy "reports own update or admin"
on public.reports
for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "reports admin delete" on public.reports;
create policy "reports admin delete"
on public.reports
for delete
using (public.is_admin());

-- ============================================
-- RLS POLICIES - PUSH TOKENS
-- ============================================

drop policy if exists "push tokens self read or admin" on public.push_tokens;
create policy "push tokens self read or admin"
on public.push_tokens
for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "push tokens self insert or admin" on public.push_tokens;
create policy "push tokens self insert or admin"
on public.push_tokens
for insert
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "push tokens self update or admin" on public.push_tokens;
create policy "push tokens self update or admin"
on public.push_tokens
for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "push tokens admin delete" on public.push_tokens;
create policy "push tokens admin delete"
on public.push_tokens
for delete
using (public.is_admin());

-- ============================================
-- RLS POLICIES - MOSQUE SETTINGS
-- ============================================

drop policy if exists "mosque settings public read" on public.mosque_settings;
create policy "mosque settings public read"
on public.mosque_settings
for select
using (true);

drop policy if exists "mosque settings admin write" on public.mosque_settings;
create policy "mosque settings admin write"
on public.mosque_settings
for all
using (public.is_admin())
with check (public.is_admin());

-- ============================================
-- RLS POLICIES - NOTIFICATION LOGS
-- ============================================

drop policy if exists "notification logs admin only" on public.notification_logs;
create policy "notification logs admin only"
on public.notification_logs
for all
using (public.is_admin())
with check (public.is_admin());

-- ============================================
-- STORAGE RLS POLICIES
-- ============================================

-- avatars
create policy "avatars public read"
on storage.objects
for select
using (bucket_id = 'avatars');

create policy "avatars user upload own folder"
on storage.objects
for insert
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = split_part(name, '/', 1)
);

create policy "avatars user update own folder"
on storage.objects
for update
using (
  bucket_id = 'avatars'
  and auth.uid()::text = split_part(name, '/', 1)
)
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = split_part(name, '/', 1)
);

create policy "avatars user delete own folder"
on storage.objects
for delete
using (
  bucket_id = 'avatars'
  and auth.uid()::text = split_part(name, '/', 1)
);

-- slides
create policy "slides public read bucket"
on storage.objects
for select
using (bucket_id = 'slides');

create policy "slides admin manage bucket"
on storage.objects
for all
using (bucket_id = 'slides' and public.is_admin())
with check (bucket_id = 'slides' and public.is_admin());

-- report-images
create policy "report images public read"
on storage.objects
for select
using (bucket_id = 'report-images');

create policy "report images user insert own folder"
on storage.objects
for insert
with check (
  bucket_id = 'report-images'
  and auth.uid()::text = split_part(name, '/', 1)
);

create policy "report images owner or admin update"
on storage.objects
for update
using (
  bucket_id = 'report-images'
  and (auth.uid()::text = split_part(name, '/', 1) or public.is_admin())
)
with check (
  bucket_id = 'report-images'
  and (auth.uid()::text = split_part(name, '/', 1) or public.is_admin())
);

create policy "report images owner or admin delete"
on storage.objects
for delete
using (
  bucket_id = 'report-images'
  and (auth.uid()::text = split_part(name, '/', 1) or public.is_admin())
);

-- ============================================
-- REALTIME
-- ============================================

alter publication supabase_realtime add table public.slides;
alter publication supabase_realtime add table public.announcements;
alter publication supabase_realtime add table public.reports;
alter publication supabase_realtime add table public.profiles;

-- ============================================
-- OPTIONAL: FIRST ADMIN MANUAL COMMAND
-- After a user registers, run this once to promote them:
-- update public.profiles set role = 'admin' where email = 'your-admin@email.com';
-- ============================================
