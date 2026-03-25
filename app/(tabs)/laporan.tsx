import { useEffect, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import { MessageSquareWarning } from 'lucide-react-native';
import { Screen } from '@/src/components/Screen';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { SectionTitle } from '@/src/components/ui/SectionTitle';
import { AppInput } from '@/src/components/ui/AppInput';
import { AppButton } from '@/src/components/ui/AppButton';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { supabase } from '@/src/lib/supabase';
import { formatDateTime } from '@/src/utils/date';

export default function LaporanScreen() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('fasilitas');
  const [description, setDescription] = useState('');
  const [reports, setReports] = useState<any[]>([]);
  const { colors } = useAppTheme();

  async function loadMyReports() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { data } = await supabase.from('reports').select('*').eq('user_id', auth.user.id).order('created_at', { ascending: false });
    setReports(data || []);
  }

  async function submit() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return Alert.alert('Gagal', 'Anda belum login');
    if (!title.trim() || !description.trim()) return Alert.alert('Data belum lengkap', 'Isi judul dan isi laporan.');
    const { error } = await supabase.from('reports').insert({
      user_id: auth.user.id,
      title,
      category,
      description,
    });
    if (error) return Alert.alert('Gagal', error.message);
    setTitle('');
    setDescription('');
    await loadMyReports();
    Alert.alert('Berhasil', 'Laporan terkirim');
  }

  useEffect(() => {
    loadMyReports();
    const channel = supabase.channel('my-reports').on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, loadMyReports).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Screen scroll={false}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View style={{ gap: 16, marginBottom: 16 }}>
            <SectionTitle title="Laporan Jamaah" subtitle="Kirim laporan fasilitas, kebersihan, keamanan, atau saran untuk admin masjid." />
            <GlassCard>
              <View style={{ gap: 12 }}>
                <AppInput label="Judul Laporan" placeholder="Contoh: Lampu teras mati" value={title} onChangeText={setTitle} />
                <AppInput label="Kategori" placeholder="fasilitas / kebersihan / keamanan" value={category} onChangeText={setCategory} />
                <AppInput
                  label="Isi Laporan"
                  placeholder="Tulis detail laporan..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={6}
                  style={{ minHeight: 120, textAlignVertical: 'top' }}
                />
                <AppButton title="Kirim Laporan" onPress={submit} />
              </View>
            </GlassCard>

            <SectionTitle title="Riwayat Laporan" subtitle="Pantau status laporan yang sudah kamu kirim." />
          </View>
        )}
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GlassCard style={{ marginBottom: 12 }}>
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <MessageSquareWarning size={18} color={colors.primary} />
                <Text style={{ fontSize: 16, fontWeight: '900', color: colors.text, flex: 1 }}>{item.title}</Text>
                <View style={{ backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 }}>
                  <Text style={{ color: colors.primary, fontWeight: '800', textTransform: 'capitalize' }}>{item.status}</Text>
                </View>
              </View>
              <Text style={{ color: colors.subtext }}>Kategori: {item.category}</Text>
              <Text style={{ color: colors.text, lineHeight: 20 }}>{item.description}</Text>
              <Text style={{ color: colors.subtext }}>{formatDateTime(item.created_at)}</Text>
            </View>
          </GlassCard>
        )}
      />
    </Screen>
  );
}
