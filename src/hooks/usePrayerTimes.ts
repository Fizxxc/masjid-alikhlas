import { useEffect, useState } from 'react';
import { getPrayerSchedule } from '@/src/lib/equran';
import { DEFAULT_MOSQUE } from '@/src/lib/constants';

export function usePrayerTimes() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const now = new Date();
        const response = await getPrayerSchedule(
          DEFAULT_MOSQUE.province,
          DEFAULT_MOSQUE.city,
          now.getMonth() + 1,
          now.getFullYear()
        );
        const normalized = response?.jadwal || response || [];
        setData(Array.isArray(normalized) ? normalized : []);
      } catch (e) {
        setError('Jadwal sholat belum dapat dimuat.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}
