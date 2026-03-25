import { useEffect, useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { Screen } from '@/src/components/Screen';
import { getDailyDoa } from '@/src/lib/equran';

export default function DoaScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getDailyDoa().then((json) => setItems(Array.isArray(json) ? json : json?.data || [])).catch(console.error);
  }, []);

  const filtered = useMemo(() => items.filter((it) => String(it.judul || '').toLowerCase().includes(query.toLowerCase())), [items, query]);

  return (
    <Screen scroll={false}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 12 }}>Doa-doa Harian</Text>
      <TextInput value={query} onChangeText={setQuery} placeholder="Cari doa..." style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12, marginBottom: 12 }} />
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => String(item.id ?? index)}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f0fdf4', borderRadius: 18, padding: 16, marginBottom: 12 }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>{item.judul}</Text>
            <Text style={{ marginTop: 10, fontSize: 24 }}>{item.arab}</Text>
            <Text style={{ marginTop: 10 }}>{item.latin}</Text>
            <Text style={{ marginTop: 10, color: '#4b5563' }}>{item.arti}</Text>
          </View>
        )}
      />
    </Screen>
  );
}
