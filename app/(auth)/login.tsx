import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mosque, ShieldCheck } from 'lucide-react-native';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { AppInput } from '@/src/components/ui/AppInput';
import { AppButton } from '@/src/components/ui/AppButton';

export default function LoginScreen() {
  const { colors, isDark } = useAppTheme();
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
    <LinearGradient colors={isDark ? ['#06100c', '#0e1d16', '#0b1511'] : ['#e9f7ed', '#f8fcf9', '#ddf7e5']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, gap: 18 }}>
          <View style={{ alignItems: 'center', gap: 10 }}>
            <View style={{ width: 78, height: 78, borderRadius: 26, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <Mosque size={34} color={colors.primary} />
            </View>
            <Text style={{ color: colors.text, fontSize: 30, fontWeight: '900' }}>Masjid Al-Ikhlas</Text>
            <Text style={{ color: colors.subtext, textAlign: 'center', maxWidth: 310, lineHeight: 21 }}>
              Login untuk akses jadwal sholat, informasi masjid, laporan jamaah, dan fitur admin.
            </Text>
          </View>

          <GlassCard intensity={65}>
            <View style={{ gap: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <ShieldCheck size={18} color={colors.primary} />
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>Masuk ke akun Anda</Text>
              </View>

              <AppInput
                label="Email"
                placeholder="Masukkan email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <AppInput
                label="Password"
                placeholder="Masukkan password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <AppButton title={loading ? 'Memproses...' : 'Login'} onPress={signIn} loading={loading} />

              <Link href="/(auth)/register" style={{ textAlign: 'center', color: colors.subtext, fontWeight: '700' }}>
                Belum punya akun? Daftar sekarang
              </Link>
            </View>
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
