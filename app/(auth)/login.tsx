import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signIn() {
    if (!email.trim() || !password.trim()) {
      return Alert.alert('Data belum lengkap', 'Isi email dan password terlebih dahulu.');
    }
    if (!isSupabaseConfigured) {
      return Alert.alert('Supabase belum diset', 'Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di file .env lalu restart Expo.');
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) return Alert.alert('Login gagal', error.message);
    router.replace('/');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 28, padding: 20, gap: 14 }}>
          <Text style={{ fontSize: 28, fontWeight: '800' }}>Masjid Al-Ikhlas</Text>
          <Text style={{ color: '#4b5563' }}>Login untuk masuk ke aplikasi jamaah dan admin.</Text>

          <View style={{ gap: 8 }}>
            <Text style={{ fontWeight: '700' }}>Email</Text>
            <TextInput placeholder="Masukkan email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontWeight: '700' }}>Password</Text>
            <TextInput placeholder="Masukkan password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 14, padding: 12 }} />
          </View>

          <Pressable onPress={signIn} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14 }}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>{loading ? 'Memproses...' : 'Login'}</Text>
          </Pressable>

          <Link href="/(auth)/register" asChild>
            <Pressable><Text style={{ textAlign: 'center' }}>Belum punya akun? Register</Text></Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
