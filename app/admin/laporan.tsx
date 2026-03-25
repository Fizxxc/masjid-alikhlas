import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Screen } from '@/src/components/Screen';
import { supabase } from '@/src/lib/supabase';
import { formatDateTime } from '@/src/utils/date';

export default function AdminLaporanScreen() {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  }

  async function setStatus(id: string, status: 'baru' | 'diproses' | 'selesai') {
    await supabase.from('reports').update({ status }).eq('id', id);
    load();
  }

  useEffect(() => {
    load();
    const channel = supabase.channel('admin-reports').on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, load).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <Screen scroll={false}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 12 }}>Laporan Masuk</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f8fafc', borderRadius: 18, padding: 16, marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ marginTop: 6 }}>Kategori: {item.category}</Text>
            <Text>Status: {item.status}</Text>
            <Text style={{ marginTop: 8 }}>{item.description}</Text>
            <Text style={{ marginTop: 8, color: '#6b7280' }}>{formatDateTime(item.created_at)}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <Pressable onPress={() => setStatus(item.id, 'baru')} style={{ backgroundColor: '#e5e7eb', padding: 10, borderRadius: 12 }}><Text>Baru</Text></Pressable>
              <Pressable onPress={() => setStatus(item.id, 'diproses')} style={{ backgroundColor: '#facc15', padding: 10, borderRadius: 12 }}><Text>Diproses</Text></Pressable>
              <Pressable onPress={() => setStatus(item.id, 'selesai')} style={{ backgroundColor: '#22c55e', padding: 10, borderRadius: 12 }}><Text>Selesai</Text></Pressable>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}
