export function formatDateTime(input: string) {
  return new Date(input).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getNextPrayer(today: Record<string, string>) {
  const order = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  const now = new Date();

  for (const key of order) {
    const time = today[key];
    if (!time) continue;
    const [h, m] = time.split(':').map(Number);
    const prayer = new Date();
    prayer.setHours(h, m, 0, 0);
    if (prayer > now) return { name: key, time };
  }

  return { name: 'subuh', time: today.subuh };
}
