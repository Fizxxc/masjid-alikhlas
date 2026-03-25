import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { BellRing, Compass, FilePlus2, Sparkles } from 'lucide-react-native';
import AutoSlider from '@/src/components/AutoSlider';
import MosqueMap from '@/src/components/MosqueMap';
import { PrayerCard } from '@/src/components/PrayerCard';
import { Screen } from '@/src/components/Screen';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { SectionTitle } from '@/src/components/ui/SectionTitle';
import { usePrayerTimes } from '@/src/hooks/usePrayerTimes';
import { registerForPushNotificationsAsync } from '@/src/lib/notifications';
import { isSupabaseConfigured, supabase } from '@/src/lib/supabase';
import { getNextPrayer } from '@/src/utils/date';
import { useAppTheme } from '@/src/hooks/useAppTheme';

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
    title: 'Mode Demo Aktif',
    content: 'Isi file .env terlebih dahulu agar data realtime, login, laporan, dan admin panel aktif sepenuhnya.',
  },
];

export default function HomeScreen() {
  const { data: prayerData, error: prayerError } = usePrayerTimes();
  const { colors } = useAppTheme();
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
    setAnnouncements(announcementData?.length ? announcementData : demoAnnouncements);
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
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Screen>
      <SectionTitle title="Masjid Al-Ikhlas" subtitle="Aplikasi informasi masjid, jadwal sholat, laporan jamaah, dan arah kiblat dengan tampilan liquid glass modern." />
      {slides.length ? <AutoSlider slides={slides} /> : null}

      {!isSupabaseConfigured ? (
        <GlassCard>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
            <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center' }}>
              <BellRing size={18} color="#c2410c" />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontWeight: '900', color: '#c2410c' }}>Mode demo aktif</Text>
              <Text style={{ color: colors.subtext, lineHeight: 20 }}>
                Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di file .env, lalu restart Expo agar semua fitur realtime aktif.
              </Text>
            </View>
          </View>
        </GlassCard>
      ) : null}

      {today ? (
        <GlassCard>
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionTitle title="Jadwal Hari Ini" subtitle="Waktu sholat utama untuk hari ini." />
              <View style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: colors.primarySoft }}>
                <Text style={{ color: colors.primary, fontWeight: '800' }}>Live</Text>
              </View>
            </View>

            {nextPrayer ? (
              <View style={{ borderRadius: 20, padding: 16, backgroundColor: colors.primarySoft }}>
                <Text style={{ color: colors.subtext }}>Sholat berikutnya</Text>
                <Text style={{ fontSize: 22, fontWeight: '900', color: colors.text, marginTop: 4, textTransform: 'capitalize' }}>
                  {nextPrayer.name} · {nextPrayer.time}
                </Text>
              </View>
            ) : null}

            <View style={{ gap: 10 }}>
              <PrayerCard name="subuh" time={today.subuh} />
              <PrayerCard name="dzuhur" time={today.dzuhur} />
              <PrayerCard name="ashar" time={today.ashar} />
              <PrayerCard name="maghrib" time={today.maghrib} />
              <PrayerCard name="isya" time={today.isya} />
            </View>
          </View>
        </GlassCard>
      ) : (
        <GlassCard>
          <Text style={{ fontWeight: '900', fontSize: 16, color: colors.text }}>Jadwal sholat belum tersedia</Text>
          <Text style={{ marginTop: 8, color: colors.subtext }}>{prayerError || 'Cek koneksi internet atau coba lagi beberapa saat.'}</Text>
        </GlassCard>
      )}

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable onPress={() => router.push('/qiblat')} style={{ flex: 1 }}>
          <GlassCard>
            <View style={{ gap: 10, alignItems: 'center', paddingVertical: 4 }}>
              <Compass color={colors.primary} />
              <Text style={{ color: colors.text, fontWeight: '800' }}>Arah Kiblat</Text>
            </View>
          </GlassCard>
        </Pressable>
        <Pressable onPress={() => router.push('/(tabs)/laporan')} style={{ flex: 1 }}>
          <GlassCard>
            <View style={{ gap: 10, alignItems: 'center', paddingVertical: 4 }}>
              <FilePlus2 color={colors.primary} />
              <Text style={{ color: colors.text, fontWeight: '800' }}>Buat Laporan</Text>
            </View>
          </GlassCard>
        </Pressable>
      </View>

      <SectionTitle title="Informasi Terkini" subtitle="Pengumuman dan update terbaru dari admin masjid." />
      {announcements.map((item) => (
        <GlassCard key={item.id}>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Sparkles size={16} color={colors.primary} />
              <Text style={{ fontSize: 16, fontWeight: '900', color: colors.text }}>{item.title}</Text>
            </View>
            <Text style={{ color: colors.subtext, lineHeight: 20 }}>{item.content}</Text>
          </View>
        </GlassCard>
      ))}

      <SectionTitle title="Lokasi Masjid" subtitle="Temukan lokasi masjid dan buka petunjuk arah dengan cepat." />
      <MosqueMap />
    </Screen>
  );
}
