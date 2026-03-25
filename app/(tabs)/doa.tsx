import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import { BookHeart, Search, ScrollText } from 'lucide-react-native';

import { Screen } from '@/src/components/Screen';
import { useAppTheme } from '@/src/hooks/useAppTheme';

type DoaItem = {
  id: string | number;
  title: string;
  arab: string;
  latin: string;
  translation: string;
};

function normalizeDoaResponse(payload: any): DoaItem[] {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.result)
    ? payload.result
    : [];

  return source.map((item: any, index: number) => ({
    id: item.id ?? index,
    title:
      item.judul ??
      item.title ??
      item.nama ??
      item.doa ??
      `Doa ${index + 1}`,
    arab: item.arab ?? '',
    latin: item.latin ?? '',
    translation:
      item.arti ??
      item.terjemah ??
      item.translation ??
      item.arti_doa ??
      '',
  }));
}

function getDoaEndpoint() {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

  if (Platform.OS === 'web') {
    if (!supabaseUrl) {
      throw new Error(
        'EXPO_PUBLIC_SUPABASE_URL belum diisi. Web butuh proxy untuk menghindari CORS.'
      );
    }

    return `${supabaseUrl}/functions/v1/equran-doa`;
  }

  return 'https://equran.id/apidev/doa';
}

export default function DoaScreen() {
  const { isDark } = useAppTheme();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<DoaItem[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadDoa() {
      try {
        setLoading(true);
        setError('');

        const endpoint = getDoaEndpoint();

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Gagal mengambil data doa (${response.status})`);
        }

        const json = await response.json();
        const normalized = normalizeDoaResponse(json);

        if (!mounted) return;
        setItems(normalized);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || 'Gagal memuat doa harian');
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDoa();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.latin.toLowerCase().includes(q) ||
        item.translation.toLowerCase().includes(q) ||
        item.arab.toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '900',
            color: isDark ? '#f8fafc' : '#0f172a',
          }}
        >
          Doa-doa Harian
        </Text>

        <Text
          style={{
            color: isDark ? 'rgba(255,255,255,0.68)' : '#64748b',
            lineHeight: 22,
          }}
        >
          Kumpulan doa harian yang dimuat realtime agar nyaman dibaca dan mudah dicari.
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          borderRadius: 18,
          paddingHorizontal: 14,
          paddingVertical: 12,
          backgroundColor: isDark
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(255,255,255,0.82)',
          borderWidth: 1,
          borderColor: isDark
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(22,163,74,0.10)',
        }}
      >
        <Search size={18} color={isDark ? 'rgba(255,255,255,0.6)' : '#64748b'} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Cari doa..."
          placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#94a3b8'}
          style={{
            flex: 1,
            color: isDark ? '#f8fafc' : '#0f172a',
            fontSize: 15,
            paddingVertical: 2,
          }}
        />
      </View>

      {loading ? (
        <View
          style={{
            paddingTop: 48,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <ActivityIndicator size="large" color="#22c55e" />
          <Text
            style={{
              color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b',
              fontWeight: '600',
            }}
          >
            Memuat doa harian...
          </Text>
        </View>
      ) : error ? (
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
          <Text style={{ color: '#9a3412', marginTop: 6 }}>
            {Platform.OS === 'web'
              ? 'Di web, endpoint EQuran perlu proxy karena CORS.'
              : 'Pastikan koneksi internet aktif lalu refresh aplikasi.'}
          </Text>
        </View>
      ) : filtered.length === 0 ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
            paddingHorizontal: 20,
            borderRadius: 24,
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.82)',
            borderWidth: 1,
            borderColor: isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(22,163,74,0.10)',
            gap: 10,
          }}
        >
          <BookHeart size={28} color="#22c55e" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              color: isDark ? '#f8fafc' : '#0f172a',
            }}
          >
            Doa tidak ditemukan
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 14, paddingBottom: 8 }}
        >
          {filtered.map((item) => (
            <View
              key={String(item.id)}
              style={{
                borderRadius: 26,
                padding: 16,
                backgroundColor: isDark
                  ? 'rgba(8, 24, 18, 0.54)'
                  : 'rgba(255,255,255,0.82)',
                borderWidth: 1,
                borderColor: isDark
                  ? 'rgba(120,255,180,0.08)'
                  : 'rgba(22,163,74,0.10)',
                gap: 12,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: isDark
                      ? 'rgba(22,163,74,0.16)'
                      : '#dcfce7',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ScrollText size={18} color="#22c55e" />
                </View>

                <Text
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: '900',
                    color: isDark ? '#f8fafc' : '#0f172a',
                  }}
                >
                  {item.title}
                </Text>
              </View>

              {!!item.arab && (
                <Text
                  style={{
                    fontSize: 24,
                    lineHeight: 42,
                    textAlign: 'right',
                    color: isDark ? '#ffffff' : '#111827',
                    fontWeight: '700',
                  }}
                >
                  {item.arab}
                </Text>
              )}

              {!!item.latin && (
                <View
                  style={{
                    borderRadius: 18,
                    padding: 14,
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.04)'
                      : '#f8fafc',
                  }}
                >
                  <Text
                    style={{
                      color: isDark ? '#d1fae5' : '#166534',
                      fontSize: 15,
                      lineHeight: 24,
                      fontStyle: 'italic',
                      fontWeight: '600',
                    }}
                  >
                    {item.latin}
                  </Text>
                </View>
              )}

              {!!item.translation && (
                <Text
                  style={{
                    color: isDark ? 'rgba(255,255,255,0.78)' : '#475569',
                    fontSize: 15,
                    lineHeight: 24,
                  }}
                >
                  {item.translation}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}