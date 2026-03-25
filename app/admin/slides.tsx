import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Screen } from '@/src/components/Screen';
import { supabase } from '@/src/lib/supabase';

export default function AdminSlidesScreen() {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const { data } = await supabase.from('slides').select('*').order('sort_order', { ascending: true });
    setItems(data || []);
  }

  async function createSlide() {
    const { error } = await supabase.from('slides').insert({ title, image_url: imageUrl, is_active: true });
    if (error) return Alert.alert('Gagal', error.message);
    setTitle(''); setImageUrl('');
    await load();
  }

  async function toggleActive(id: string, isActive: boolean) {
    await supabase.from('slides').update({ is_active: !isActive }).eq('id', id);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <Screen scroll={false}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 12 }}>Kelola Slide</Text>
      <FlatList
        ListHeaderComponent={(
          <View style={{ gap: 10, marginBottom: 16 }}>
            <TextInput placeholder="Judul slide" value={title} onChangeText={setTitle} style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
            <TextInput placeholder="URL gambar slide" value={imageUrl} onChangeText={setImageUrl} autoCapitalize="none" style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
            <Pressable onPress={createSlide} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Tambah Slide</Text></Pressable>
            <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 10 }}>Daftar Slide</Text>
          </View>
        )}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f8fafc', borderRadius: 18, padding: 16, marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ marginTop: 8 }}>{item.image_url}</Text>
            <Pressable onPress={() => toggleActive(item.id, item.is_active)} style={{ marginTop: 10, backgroundColor: '#16a34a', padding: 12, borderRadius: 12 }}><Text style={{ color: '#fff', textAlign: 'center' }}>{item.is_active ? 'Nonaktifkan' : 'Aktifkan'}</Text></Pressable>
          </View>
        )}
      />
    </Screen>
  );
}
