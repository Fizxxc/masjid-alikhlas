import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { supabase } from '@/src/lib/supabase';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ users: 0, reports: 0, slides: 0, announcements: 0 });

  async function load() {
    const [users, reports, slides, announcements] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }),
      supabase.from('slides').select('*', { count: 'exact', head: true }),
      supabase.from('announcements').select('*', { count: 'exact', head: true }),
    ]);
    setCounts({
      users: users.count || 0,
      reports: reports.count || 0,
      slides: slides.count || 0,
      announcements: announcements.count || 0,
    });
  }

  useEffect(() => { load(); }, []);

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: '800' }}>Admin Dashboard</Text>
      {Object.entries(counts).map(([key, value]) => (
        <View key={key} style={{ backgroundColor: '#f0fdf4', borderRadius: 18, padding: 16 }}>
          <Text style={{ fontWeight: '700', textTransform: 'capitalize' }}>{key}</Text>
          <Text style={{ marginTop: 6, fontSize: 24 }}>{value}</Text>
        </View>
      ))}
      <Pressable onPress={() => router.push('/admin/info')} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Kelola Informasi</Text></Pressable>
      <Pressable onPress={() => router.push('/admin/slides')} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Kelola Slide</Text></Pressable>
      <Pressable onPress={() => router.push('/admin/laporan')} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Kelola Laporan</Text></Pressable>
      <Pressable onPress={() => router.push('/admin/users')} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Kelola User</Text></Pressable>
    </Screen>
  );
}
