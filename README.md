# Masjid Al-Ikhlas

Starter app Expo + Supabase untuk Masjid Al-Ikhlas.

## Fitur
- Login / register
- Role user / admin
- Home slider realtime
- Informasi teks realtime
- Jadwal sholat EQuran
- Doa-doa page
- Laporan realtime
- Push notification Expo ke HP
- Profil, upload avatar, ganti password
- Tema light / dark / system
- Lokasi masjid dan arah kiblat realtime
- Donasi coming soon

## Install
```bash
npm install
cp .env.example .env
npm run start
```

## Environment
Isi file `.env` sesuai proyek Supabase Anda.

## Setup Supabase
1. Buat project Supabase.
2. Jalankan isi `supabase/schema.sql` di SQL Editor.
3. Promote akun admin pertama:
```sql
update public.profiles set role = 'admin' where email = 'email-admin-anda';
```
4. Deploy edge function:
```bash
supabase functions deploy send-report-notification
supabase functions deploy send-manual-notification
```
5. Buat database webhook atau trigger sesuai kebutuhan Anda untuk memanggil `send-report-notification` saat tabel `reports` menerima insert baru.

## Catatan push notification
Remote push Expo untuk Android memerlukan development build atau production build; fitur remote push tidak tersedia seperti biasa di Expo Go Android sejak SDK 53. Dokumentasi Expo juga menjelaskan setup `expo-notifications`, kredensial Android/iOS, dan pengiriman via Expo Push Service. citeturn537304search0turn537304search3turn537304search6

## Catatan SDK dan backend
Supabase mendukung Auth untuk React Native/Expo dan inisialisasi client dengan penyimpanan sesi lokal. EQuran menyediakan package npm resmi `equran` serta API developer untuk data Al-Quran dan jadwal terkait. citeturn537304search1turn537304search4turn537304search2turn537304search5
