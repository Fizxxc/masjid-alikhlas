import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mosque, UserPlus } from 'lucide-react-native';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { AppInput } from '@/src/components/ui/AppInput';
import { AppButton } from '@/src/components/ui/AppButton';

export default function RegisterScreen() {
  const { colors, isDark } = useAppTheme();
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
    <LinearGradient colors={isDark ? ['#06100c', '#0e1d16', '#0b1511'] : ['#e9f7ed', '#f8fcf9', '#ddf7e5']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, gap: 18 }}>
          <View style={{ alignItems: 'center', gap: 10 }}>
            <View style={{ width: 78, height: 78, borderRadius: 26, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <Mosque size={34} color={colors.primary} />
            </View>
            <Text style={{ color: colors.text, fontSize: 30, fontWeight: '900' }}>Buat Akun Baru</Text>
            <Text style={{ color: colors.subtext, textAlign: 'center', maxWidth: 310, lineHeight: 21 }}>
              Daftar sebagai jamaah untuk menerima informasi masjid, jadwal sholat, dan fitur laporan realtime.
            </Text>
          </View>

          <GlassCard intensity={65}>
            <View style={{ gap: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <UserPlus size={18} color={colors.primary} />
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>Registrasi akun</Text>
              </View>

              <AppInput label="Nama Lengkap" placeholder="Masukkan nama lengkap" value={fullName} onChangeText={setFullName} />
              <AppInput label="Email" placeholder="Masukkan email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
              <AppInput label="Password" placeholder="Minimal 6 karakter" value={password} onChangeText={setPassword} secureTextEntry />

              <AppButton title={loading ? 'Memproses...' : 'Register'} onPress={signUp} loading={loading} />

              <Link href="/(auth)/login" style={{ textAlign: 'center', color: colors.subtext, fontWeight: '700' }}>
                Sudah punya akun? Login
              </Link>
            </View>
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
