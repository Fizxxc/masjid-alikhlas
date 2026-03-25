import { Text } from 'react-native';
import { PrayerCard } from '@/src/components/PrayerCard';
import { Screen } from '@/src/components/Screen';
import { usePrayerTimes } from '@/src/hooks/usePrayerTimes';

export default function JadwalScreen() {
  const { data } = usePrayerTimes();
  const today = data.find((it: any) => new Date(it.tanggal).getDate() === new Date().getDate()) || data[0];

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: '800' }}>Jadwal Sholat</Text>
      {today ? (
        <>
          <PrayerCard name="imsak" time={today.imsak} />
          <PrayerCard name="subuh" time={today.subuh} />
          <PrayerCard name="dhuha" time={today.dhuha} />
          <PrayerCard name="dzuhur" time={today.dzuhur} />
          <PrayerCard name="ashar" time={today.ashar} />
          <PrayerCard name="maghrib" time={today.maghrib} />
          <PrayerCard name="isya" time={today.isya} />
        </>
      ) : <Text>Memuat jadwal...</Text>}
    </Screen>
  );
}
