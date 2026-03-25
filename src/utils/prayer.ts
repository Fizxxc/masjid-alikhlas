export type NextPrayerResult = {
  name: string;
  time: string;
  diffMs: number;
};

const prayerKeys = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'] as const;

function createDateForTime(baseDate: Date, time: string) {
  const [hour, minute] = String(time).split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hour || 0, minute || 0, 0, 0);
  return date;
}

export function getNextPrayerRealtime(today: any, now: Date): NextPrayerResult | null {
  if (!today) return null;

  for (const key of prayerKeys) {
    const value = today[key];
    if (!value) continue;

    const prayerDate = createDateForTime(now, value);
    if (prayerDate.getTime() > now.getTime()) {
      return {
        name: key,
        time: value,
        diffMs: prayerDate.getTime() - now.getTime(),
      };
    }
  }

  return null;
}

export function formatCountdown(ms: number) {
  if (ms <= 0) return '00:00:00';

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((item) => String(item).padStart(2, '0'))
    .join(':');
}

export function formatLiveDate(date: Date) {
  return {
    time: new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date),
    fullDate: new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date),
  };
}