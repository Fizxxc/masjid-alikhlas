import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AutoSlider } from '@/src/components/AutoSlider';
import { MosqueMap } from '@/src/components/MosqueMap';
import { PrayerCard } from '@/src/components/PrayerCard';
import { Screen } from '@/src/components/Screen';
import { usePrayerTimes } from '@/src/hooks/usePrayerTimes';
import { registerForPushNotificationsAsync } from '@/src/lib/notifications';
import { isSupabaseConfigured, supabase } from '@/src/lib/supabase';
import { getNextPrayer } from '@/src/utils/date';

const demoSlides = [
  {
    id: 'demo-1',
    title: 'Selamat Datang di Masjid Al-Ikhlas',
    image_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1200&auto=format&fit=crop',
  },
];

const demoAnnouncements = [
  {
    id: 'demo-a',
    title: 'Supabase belum dikonfigurasi',
    content: 'Isi file .env terlebih dahulu agar data realtime, login, laporan, dan admin panel aktif sepenuhnya.',
  },
];

export default function HomeScreen() {
  const { data: prayerData, error: prayerError } = usePrayerTimes();
  const [slides, setSlides] = useState<any[]>(demoSlides);
  const [announcements, setAnnouncements] = useState<any[]>(demoAnnouncements);
  const today = useMemo(() => prayerData.find((it: any) => new Date(it.tanggal).getDate() === new Date().getDate()) || prayerData[0], [prayerData]);
  const nextPrayer = useMemo(() => (today ? getNextPrayer(today) : null), [today]);

  async function loadHome() {
    if (!isSupabaseConfigured) {
      setSlides(demoSlides);
      setAnnouncements(demoAnnouncements);
      return;
    }

    const [{ data: slideData }, { data: announcementData }, userResponse] = await Promise.all([
      supabase.from('slides').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      supabase.from('announcements').select('*').eq('is_active', true).order('is_pinned', { ascending: false }).order('created_at', { ascending: false }),
      supabase.auth.getUser(),
    ]);
    setSlides(slideData?.length ? slideData : demoSlides);
    setAnnouncements(announcementData?.length ? announcementData : []);
    const user = userResponse.data.user;
    if (user) await registerForPushNotificationsAsync(user.id);
  }

  useEffect(() => {
    loadHome();
    if (!isSupabaseConfigured) return;
    const channel = supabase
      .channel('home-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'slides' }, loadHome)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, loadHome)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: '800' }}>Masjid Al-Ikhlas</Text>
      <Text style={{ color: '#4b5563' }}>Aplikasi informasi masjid, jadwal sholat, laporan jamaah, dan arah kiblat.</Text>
      {slides.length ? <AutoSlider slides={slides} /> : null}

      {!isSupabaseConfigured ? (
        <View style={{ backgroundColor: '#fff7ed', padding: 14, borderRadius: 18, gap: 6 }}>
          <Text style={{ fontWeight: '700', color: '#9a3412' }}>Mode demo aktif</Text>
          <Text style={{ color: '#9a3412' }}>Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di file .env, lalu restart Expo agar semua fitur realtime aktif.</Text>
        </View>
      ) : null}

      {today ? (
        <View style={{ backgroundColor: '#f0fdf4', padding: 16, borderRadius: 18, gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>Jadwal Hari Ini</Text>
          {nextPrayer ? <Text>Sholat berikutnya: <Text style={{ fontWeight: '700', textTransform: 'capitalize' }}>{nextPrayer.name}</Text> pukul {nextPrayer.time}</Text> : null}
          <View style={{ gap: 10 }}>
            <PrayerCard name="subuh" time={today.subuh} />
            <PrayerCard name="dzuhur" time={today.dzuhur} />
            <PrayerCard name="ashar" time={today.ashar} />
            <PrayerCard name="maghrib" time={today.maghrib} />
            <PrayerCard name="isya" time={today.isya} />
          </View>
        </View>
      ) : (
        <View style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 18 }}>
          <Text style={{ fontWeight: '700' }}>Jadwal sholat belum tersedia</Text>
          <Text style={{ marginTop: 6, color: '#4b5563' }}>{prayerError || 'Cek koneksi internet atau coba lagi beberapa saat.'}</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
        <Pressable onPress={() => router.push('/qiblat')} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14, flex: 1 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Arah Kiblat</Text></Pressable>
        <Pressable onPress={() => router.push('/(tabs)/laporan')} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14, flex: 1 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Buat Laporan</Text></Pressable>
      </View>

      <Text style={{ fontSize: 20, fontWeight: '700' }}>Informasi Terkini</Text>
      {announcements.map((item) => (
        <View key={item.id} style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 18 }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.title}</Text>
          <Text style={{ marginTop: 8 }}>{item.content}</Text>
        </View>
      ))}

      <Text style={{ fontSize: 20, fontWeight: '700' }}>Lokasi Masjid</Text>
      <MosqueMap />
    </Screen>
  );
}
