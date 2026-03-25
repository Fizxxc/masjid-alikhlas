import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Screen } from '@/src/components/Screen';
import { supabase } from '@/src/lib/supabase';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<any[]>([]);

  async function load() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
  }

  async function setRole(id: string, role: 'user' | 'admin') {
    await supabase.from('profiles').update({ role }).eq('id', id);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <Screen scroll={false}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 12 }}>Kelola User</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f8fafc', borderRadius: 18, padding: 16, marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.full_name || 'Tanpa nama'}</Text>
            <Text style={{ marginTop: 6 }}>{item.id}</Text>
            <Text>Role: {item.role}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Pressable onPress={() => setRole(item.id, 'user')} style={{ backgroundColor: '#e5e7eb', padding: 10, borderRadius: 12 }}><Text>User</Text></Pressable>
              <Pressable onPress={() => setRole(item.id, 'admin')} style={{ backgroundColor: '#16a34a', padding: 10, borderRadius: 12 }}><Text style={{ color: '#fff' }}>Admin</Text></Pressable>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}
