import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Screen } from '@/src/components/Screen';
import { supabase } from '@/src/lib/supabase';

export default function AdminInfoScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  }

  async function createAnnouncement() {
    const { error } = await supabase.from('announcements').insert({ title, content, is_active: true });
    if (error) return Alert.alert('Gagal', error.message);
    setTitle(''); setContent('');
    await load();
  }

  async function toggleActive(id: string, isActive: boolean) {
    await supabase.from('announcements').update({ is_active: !isActive }).eq('id', id);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <Screen scroll={false}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 12 }}>Kelola Informasi</Text>
      <FlatList
        ListHeaderComponent={(
          <View style={{ gap: 10, marginBottom: 16 }}>
            <TextInput placeholder="Judul info" value={title} onChangeText={setTitle} style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
            <TextInput placeholder="Isi informasi" value={content} onChangeText={setContent} multiline numberOfLines={5} style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12, minHeight: 110, textAlignVertical: 'top' }} />
            <Pressable onPress={createAnnouncement} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Simpan Informasi</Text></Pressable>
            <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 10 }}>Daftar Informasi</Text>
          </View>
        )}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f8fafc', borderRadius: 18, padding: 16, marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ marginTop: 8 }}>{item.content}</Text>
            <Pressable onPress={() => toggleActive(item.id, item.is_active)} style={{ marginTop: 10, backgroundColor: '#16a34a', padding: 12, borderRadius: 12 }}><Text style={{ color: '#fff', textAlign: 'center' }}>{item.is_active ? 'Nonaktifkan' : 'Aktifkan'}</Text></Pressable>
          </View>
        )}
      />
    </Screen>
  );
}
