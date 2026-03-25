import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signUp() {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      return Alert.alert('Data belum lengkap', 'Isi nama, email, dan password terlebih dahulu.');
    }
    if (password.trim().length < 6) {
      return Alert.alert('Password terlalu pendek', 'Gunakan minimal 6 karakter.');
    }
    if (!isSupabaseConfigured) {
      return Alert.alert('Supabase belum diset', 'Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di file .env lalu restart Expo.');
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });
    setLoading(false);
    if (error) return Alert.alert('Register gagal', error.message);
    Alert.alert('Berhasil', 'Akun berhasil dibuat. Silakan login.');
    router.replace('/(auth)/login');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 28, padding: 20, gap: 14 }}>
          <Text style={{ fontSize: 28, fontWeight: '800' }}>Daftar Akun</Text>
          <Text style={{ color: '#4b5563' }}>Isi data di bawah ini untuk membuat akun jamaah.</Text>

          <View style={{ gap: 8 }}>
            <Text style={{ fontWeight: '700' }}>Nama Lengkap</Text>
            <TextInput placeholder="Masukkan nama lengkap" value={fullName} onChangeText={setFullName} style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontWeight: '700' }}>Email</Text>
            <TextInput placeholder="Masukkan email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontWeight: '700' }}>Password</Text>
            <TextInput placeholder="Minimal 6 karakter" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
          </View>

          <Pressable onPress={signUp} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14 }}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>{loading ? 'Memproses...' : 'Register'}</Text>
          </Pressable>

          <Link href="/(auth)/login" asChild>
            <Pressable><Text style={{ textAlign: 'center' }}>Sudah punya akun? Login</Text></Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
