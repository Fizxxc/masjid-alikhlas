import { useEffect, useState } from 'react';
import { Alert, Image, Switch, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { MoonStar, UserRound } from 'lucide-react-native';
import { Screen } from '@/src/components/Screen';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { SectionTitle } from '@/src/components/ui/SectionTitle';
import { AppInput } from '@/src/components/ui/AppInput';
import { AppButton } from '@/src/components/ui/AppButton';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useSettingsStore } from '@/src/store/settings-store';
import { supabase } from '@/src/lib/supabase';

export default function ProfileScreen() {
  const { colors } = useAppTheme();
  const setThemeMode = useSettingsStore((state) => state.setTheme);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  async function loadProfile() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', auth.user.id).single();
    if (data) {
      setFullName(data.full_name || '');
      setAddress(data.address || '');
      setTheme(data.theme || 'system');
      setThemeMode(data.theme || 'system');
      setNotificationsEnabled(!!data.notifications_enabled);
      setAvatarUrl(data.avatar_url || '');
    }
  }

  async function saveProfile() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { error } = await supabase.from('profiles').update({ full_name: fullName, address, theme, notifications_enabled: notificationsEnabled }).eq('id', auth.user.id);
    if (error) return Alert.alert('Gagal', error.message);
    setThemeMode(theme);
    if (newPassword.trim()) {
      const pw = await supabase.auth.updateUser({ password: newPassword.trim() });
      if (pw.error) return Alert.alert('Password gagal diubah', pw.error.message);
      setNewPassword('');
    }
    Alert.alert('Berhasil', 'Profil diperbarui');
  }

  async function uploadAvatar() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const image = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [1, 1] });
    if (image.canceled || !image.assets[0]) return;
    const asset = image.assets[0];
    const response = await fetch(asset.uri);
    const blob = await response.blob();
    const path = `${auth.user.id}/avatar.jpg`;
    const upload = await supabase.storage.from('avatars').upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
    if (upload.error) return Alert.alert('Upload gagal', upload.error.message);
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', auth.user.id);
    Alert.alert('Berhasil', 'Foto profil diperbarui');
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <Screen>
      <SectionTitle title="Profil & Settings" subtitle="Atur profil, preferensi tema, notifikasi, dan keamanan akun Anda." />

      <GlassCard>
        <View style={{ alignItems: 'center', gap: 14 }}>
          <View style={{ width: 96, height: 96, borderRadius: 32, overflow: 'hidden', backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
            {avatarUrl ? <Image source={{ uri: avatarUrl }} style={{ width: '100%', height: '100%' }} /> : <UserRound size={38} color={colors.primary} />}
          </View>
          <AppButton title="Upload Foto Profil" onPress={uploadAvatar} variant="secondary" />
        </View>
      </GlassCard>

      <GlassCard>
        <View style={{ gap: 12 }}>
          <AppInput label="Nama Lengkap" placeholder="Nama lengkap" value={fullName} onChangeText={setFullName} />
          <AppInput label="Alamat" placeholder="Alamat" value={address} onChangeText={setAddress} />
          <AppInput label="Ganti Password Baru" placeholder="Kosongkan jika tidak ingin diubah" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
        </View>
      </GlassCard>

      <GlassCard>
        <View style={{ gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <MoonStar size={18} color={colors.primary} />
            <Text style={{ color: colors.text, fontWeight: '900', fontSize: 16 }}>Tema Aplikasi</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {(['light', 'dark', 'system'] as const).map((item) => {
              const active = theme === item;
              return (
                <View key={item} style={{ flex: 1 }}>
                  <AppButton
                    title={item}
                    variant={active ? 'primary' : 'secondary'}
                    onPress={() => setTheme(item)}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </GlassCard>

      <GlassCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ gap: 4, flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: '900', fontSize: 16 }}>Notifikasi</Text>
            <Text style={{ color: colors.subtext }}>Aktifkan notifikasi push untuk laporan dan informasi penting.</Text>
          </View>
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} thumbColor={notificationsEnabled ? colors.primary : '#d1d5db'} />
        </View>
      </GlassCard>

      <View style={{ gap: 12 }}>
        <AppButton title="Simpan Perubahan" onPress={saveProfile} />
        <AppButton title="Donasi (Coming Soon)" onPress={() => router.push('/donasi')} variant="secondary" />
        <AppButton title="Logout" onPress={logout} variant="danger" />
      </View>
    </Screen>
  );
}
