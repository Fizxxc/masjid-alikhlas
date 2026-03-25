import { useEffect, useState } from 'react';
import { Alert, Pressable, Switch, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { supabase } from '@/src/lib/supabase';

export default function ProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [newPassword, setNewPassword] = useState('');

  async function loadProfile() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', auth.user.id).single();
    if (data) {
      setFullName(data.full_name || '');
      setAddress(data.address || '');
      setTheme(data.theme || 'system');
      setNotificationsEnabled(!!data.notifications_enabled);
    }
  }

  async function saveProfile() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { error } = await supabase.from('profiles').update({ full_name: fullName, address, theme, notifications_enabled: notificationsEnabled }).eq('id', auth.user.id);
    if (error) return Alert.alert('Gagal', error.message);
    if (newPassword) {
      const pw = await supabase.auth.updateUser({ password: newPassword });
      if (pw.error) return Alert.alert('Password gagal diubah', pw.error.message);
    }
    Alert.alert('Berhasil', 'Profil diperbarui');
  }

  async function uploadAvatar() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const image = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (image.canceled || !image.assets[0]) return;
    const asset = image.assets[0];
    const response = await fetch(asset.uri);
    const blob = await response.blob();
    const path = `${auth.user.id}/avatar.jpg`;
    const upload = await supabase.storage.from('avatars').upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
    if (upload.error) return Alert.alert('Upload gagal', upload.error.message);
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', auth.user.id);
    Alert.alert('Berhasil', 'Foto profil diperbarui');
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  }

  useEffect(() => { loadProfile(); }, []);

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: '800' }}>Profil & Settings</Text>
      <Pressable onPress={uploadAvatar} style={{ backgroundColor: '#f0fdf4', padding: 14, borderRadius: 14 }}><Text style={{ textAlign: 'center', fontWeight: '700' }}>Upload Foto Profil</Text></Pressable>
      <TextInput placeholder="Nama lengkap" value={fullName} onChangeText={setFullName} style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
      <TextInput placeholder="Alamat" value={address} onChangeText={setAddress} style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
      <TextInput placeholder="Ganti password baru" value={newPassword} onChangeText={setNewPassword} secureTextEntry style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
      <View style={{ gap: 10 }}>
        <Text style={{ fontWeight: '700' }}>Tema</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['light', 'dark', 'system'] as const).map((item) => (
            <Pressable key={item} onPress={() => setTheme(item)} style={{ backgroundColor: theme === item ? '#16a34a' : '#e5e7eb', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 }}>
              <Text style={{ color: theme === item ? '#fff' : '#111827' }}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: '700' }}>Notifikasi</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>
      <Pressable onPress={saveProfile} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Simpan Perubahan</Text></Pressable>
      <Pressable onPress={() => router.push('/donasi')} style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 14 }}><Text style={{ textAlign: 'center', fontWeight: '700' }}>Donasi (Coming Soon)</Text></Pressable>
      <Pressable onPress={logout} style={{ backgroundColor: '#ef4444', padding: 14, borderRadius: 14 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Logout</Text></Pressable>
    </Screen>
  );
}
