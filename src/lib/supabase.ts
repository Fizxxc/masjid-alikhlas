import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey && !String(url).includes('example.supabase.co'));

if (!isSupabaseConfigured) {
  console.warn('Supabase env belum diisi. Lihat .env.example');
}

export const supabase = createClient(url || 'https://example.supabase.co', anonKey || 'public-anon-key', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
