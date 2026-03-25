import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Screen } from '@/src/components/Screen';
import { supabase } from '@/src/lib/supabase';
import { formatDateTime } from '@/src/utils/date';

export default function LaporanScreen() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('fasilitas');
  const [description, setDescription] = useState('');
  const [reports, setReports] = useState<any[]>([]);

  async function loadMyReports() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { data } = await supabase.from('reports').select('*').eq('user_id', auth.user.id).order('created_at', { ascending: false });
    setReports(data || []);
  }

  async function submit() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return Alert.alert('Gagal', 'Anda belum login');
    const { error } = await supabase.from('reports').insert({
      user_id: auth.user.id,
      title,
      category,
      description,
    });
    if (error) return Alert.alert('Gagal', error.message);
    setTitle('');
    setDescription('');
    await loadMyReports();
    Alert.alert('Berhasil', 'Laporan terkirim');
  }

  useEffect(() => {
    loadMyReports();
    const channel = supabase.channel('my-reports').on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, loadMyReports).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <Screen scroll={false}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 12 }}>Laporan</Text>
      <FlatList
        ListHeaderComponent={(
          <View style={{ gap: 10, marginBottom: 16 }}>
            <TextInput placeholder="Judul laporan" value={title} onChangeText={setTitle} style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
            <TextInput placeholder="Kategori" value={category} onChangeText={setCategory} style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
            <TextInput placeholder="Isi laporan" value={description} onChangeText={setDescription} multiline numberOfLines={5} style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12, minHeight: 120, textAlignVertical: 'top' }} />
            <Pressable onPress={submit} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Kirim Laporan</Text></Pressable>
            <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 10 }}>Riwayat Laporan</Text>
          </View>
        )}
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f8fafc', borderRadius: 18, padding: 16, marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ marginTop: 4 }}>Kategori: {item.category}</Text>
            <Text>Status: {item.status}</Text>
            <Text style={{ marginTop: 8 }}>{item.description}</Text>
            <Text style={{ marginTop: 8, color: '#6b7280' }}>{formatDateTime(item.created_at)}</Text>
          </View>
        )}
      />
    </Screen>
  );
}
