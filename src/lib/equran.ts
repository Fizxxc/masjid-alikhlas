import { EQuran } from 'equran';

export const quran = new EQuran({
  cache: {
    enabled: true,
    ttl: 60 * 60 * 1000,
    maxSize: 200,
  },
});

export async function getPrayerSchedule(provinsi: string, kabkota: string, bulan?: number, tahun?: number) {
  try {
    const res = await fetch('https://equran.id/api/v2/shalat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provinsi, kabkota, bulan, tahun }),
    });
    if (!res.ok) throw new Error('Gagal mengambil jadwal sholat');
    const json = await res.json();
    return json?.data ?? json;
  } catch (error) {
    console.warn('Gagal mengambil jadwal sholat dari EQuran:', error);
    return [];
  }
}

export async function getDailyDoa() {
  try {
    const res = await fetch('https://equran.id/api/doa');
    if (!res.ok) throw new Error('Gagal mengambil doa');
    return res.json();
  } catch (error) {
    console.warn('Gagal mengambil daftar doa:', error);
    return [];
  }
}
