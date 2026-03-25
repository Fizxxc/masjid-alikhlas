import { Linking, Pressable, Text, View } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { DEFAULT_MOSQUE } from '@/src/lib/constants';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export default function MosqueMap() {
  const { colors } = useAppTheme();
  const mapsUrl = `https://www.google.com/maps?q=${DEFAULT_MOSQUE.latitude},${DEFAULT_MOSQUE.longitude}`;

  return (
    <GlassCard intensity={40}>
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <MapPin size={18} color={colors.primary} />
          <Text style={{ color: colors.text, fontWeight: '900', fontSize: 16 }}>Lokasi Masjid Al-Ikhlas</Text>
        </View>
        <Text style={{ color: colors.subtext, lineHeight: 20 }}>
          Koordinat: {DEFAULT_MOSQUE.latitude}, {DEFAULT_MOSQUE.longitude}
        </Text>
        <Pressable
          onPress={() => Linking.openURL(mapsUrl)}
          style={{
            backgroundColor: colors.primarySoft,
            minHeight: 48,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Navigation size={16} color={colors.primary} />
          <Text style={{ color: colors.primary, fontWeight: '800' }}>Buka di Google Maps</Text>
        </Pressable>
      </View>
    </GlassCard>
  );
}
