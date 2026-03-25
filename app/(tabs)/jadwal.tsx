import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { CalendarDays, Clock3 } from 'lucide-react-native';

import { Screen } from '@/src/components/Screen';
import { getPrayerSchedule } from '@/src/lib/equran';
import {
  formatCountdown,
  formatLiveDate,
  getNextPrayerRealtime,
} from '@/src/utils/prayer';
import { useAppTheme } from '@/src/hooks/useAppTheme';

type PrayerRowProps = {
  name: string;
  time: string;
  active?: boolean;
};

function PrayerRow({ name, time, active = false }: PrayerRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderRadius: 24,
        padding: 16,
        backgroundColor: active
          ? 'rgba(236,253,245,0.92)'
          : 'rgba(10, 22, 18, 0.52)',
        borderWidth: 1,
        borderColor: active
          ? 'rgba(134,239,172,0.55)'
          : 'rgba(120, 255, 180, 0.08)',
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          backgroundColor: active ? '#16a34a' : 'rgba(22,163,74,0.18)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Clock3 size={18} color={active ? '#ffffff' : '#22c55e'} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: active ? '#64748b' : 'rgba(226,232,240,0.7)',
            fontSize: 14,
            fontWeight: '700',
            textTransform: 'capitalize',
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            color: active ? '#0f172a' : '#f8fafc',
            fontSize: 18,
            fontWeight: '900',
            marginTop: 4,
            letterSpacing: 0.3,
          }}
        >
          {time}
        </Text>
      </View>

      {active ? (
        <View
          style={{
            backgroundColor: '#16a34a',
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 12,
              fontWeight: '800',
            }}
          >
            Berikutnya
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default function JadwalScreen() {
  const { isDark } = useAppTheme();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadSchedule() {
      try {
        setLoading(true);
        setError('');

        const current = new Date();
        const data = await getPrayerSchedule(
          'JAWA BARAT',
          'KOTA BEKASI',
          current.getMonth() + 1,
          current.getFullYear()
        );

        setItems(data?.jadwal || data || []);
      } catch (err: any) {
        setError(err?.message || 'Gagal mengambil jadwal sholat');
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, []);

  const today = useMemo(() => {
    if (!items.length) return null;

    const currentDay = now.getDate();

    return (
      items.find((it) => {
        if (!it?.tanggal) return false;
        const parts = String(it.tanggal).split('-');
        const day = Number(parts[2]);
        return day === currentDay;
      }) || items[0]
    );
  }, [items, now]);

  const nextPrayer = useMemo(() => {
    if (!today) return null;
    return getNextPrayerRealtime(today, now);
  }, [today, now]);

  const liveDate = formatLiveDate(now);

  if (loading) {
    return (
      <Screen>
        <View
          style={{
            paddingTop: 80,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#22c55e" />
          <Text
            style={{
              color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b',
              marginTop: 14,
              fontWeight: '600',
            }}
          >
            Memuat jadwal sholat...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View
        style={{
          borderRadius: 28,
          padding: 18,
          backgroundColor: isDark
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(255,255,255,0.82)',
          borderWidth: 1,
          borderColor: isDark
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(22,163,74,0.10)',
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: '900',
            color: isDark ? '#f8fafc' : '#0f172a',
          }}
        >
          Jadwal Sholat
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 10,
          }}
        >
          <CalendarDays size={16} color="#22c55e" />
          <Text
            style={{
              color: isDark ? 'rgba(255,255,255,0.65)' : '#64748b',
              fontSize: 14,
              fontWeight: '600',
            }}
          >
            {liveDate.fullDate}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 8,
          }}
        >
          <Clock3 size={16} color="#22c55e" />
          <Text
            style={{
              color: '#22c55e',
              fontSize: 18,
              fontWeight: '900',
              letterSpacing: 0.4,
            }}
          >
            {liveDate.time}
          </Text>
        </View>
      </View>

      {error ? (
        <View
          style={{
            backgroundColor: '#fff7ed',
            borderColor: '#fdba74',
            borderWidth: 1,
            borderRadius: 24,
            padding: 16,
          }}
        >
          <Text style={{ color: '#9a3412', fontWeight: '700' }}>{error}</Text>
        </View>
      ) : null}

      {nextPrayer ? (
        <View
          style={{
            borderRadius: 30,
            padding: 18,
            backgroundColor: '#16a34a',
            shadowColor: '#16a34a',
            shadowOpacity: 0.25,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 8 },
            elevation: 4,
          }}
        >
          <Text
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 14,
              fontWeight: '800',
            }}
          >
            Sholat Berikutnya
          </Text>

          <Text
            style={{
              color: '#ffffff',
              fontSize: 26,
              fontWeight: '900',
              textTransform: 'capitalize',
              marginTop: 8,
            }}
          >
            {nextPrayer.name}
          </Text>

          <Text
            style={{
              color: 'rgba(255,255,255,0.92)',
              marginTop: 4,
              fontSize: 16,
              fontWeight: '700',
            }}
          >
            Pukul {nextPrayer.time}
          </Text>

          <View
            style={{
              marginTop: 16,
              borderRadius: 22,
              paddingVertical: 20,
              paddingHorizontal: 16,
              backgroundColor: 'rgba(255,255,255,0.16)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.10)',
            }}
          >
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontSize: 32,
                fontWeight: '900',
                letterSpacing: 1,
              }}
            >
              {formatCountdown(nextPrayer.diffMs)}
            </Text>

            <Text
              style={{
                color: 'rgba(255,255,255,0.85)',
                textAlign: 'center',
                marginTop: 8,
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              Countdown menuju waktu sholat
            </Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            borderRadius: 24,
            padding: 16,
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(255,255,255,0.82)',
            borderWidth: 1,
            borderColor: isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(22,163,74,0.10)',
          }}
        >
          <Text
            style={{
              color: isDark ? '#f8fafc' : '#0f172a',
              fontWeight: '800',
            }}
          >
            Semua jadwal hari ini sudah lewat
          </Text>
        </View>
      )}

      <View style={{ gap: 14 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '900',
            color: isDark ? '#f8fafc' : '#0f172a',
            marginTop: 4,
          }}
        >
          Waktu Sholat Hari Ini
        </Text>

        {today ? (
          <>
            <PrayerRow
              name="subuh"
              time={today.subuh}
              active={nextPrayer?.name === 'subuh'}
            />
            <PrayerRow
              name="dzuhur"
              time={today.dzuhur}
              active={nextPrayer?.name === 'dzuhur'}
            />
            <PrayerRow
              name="ashar"
              time={today.ashar}
              active={nextPrayer?.name === 'ashar'}
            />
            <PrayerRow
              name="maghrib"
              time={today.maghrib}
              active={nextPrayer?.name === 'maghrib'}
            />
            <PrayerRow
              name="isya"
              time={today.isya}
              active={nextPrayer?.name === 'isya'}
            />
          </>
        ) : (
          <View
            style={{
              borderRadius: 24,
              padding: 16,
              backgroundColor: isDark
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(255,255,255,0.82)',
              borderWidth: 1,
              borderColor: isDark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(22,163,74,0.10)',
            }}
          >
            <Text
              style={{
                color: isDark ? '#f8fafc' : '#0f172a',
                fontWeight: '700',
              }}
            >
              Jadwal belum tersedia
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
}