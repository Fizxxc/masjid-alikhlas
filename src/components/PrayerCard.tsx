import { Clock3 } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { GlassCard } from '@/src/components/ui/GlassCard';

export function PrayerCard({ name, time }: { name: string; time: string }) {
  const { colors } = useAppTheme();

  return (
    <GlassCard intensity={40} style={{ padding: 0 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primarySoft,
            }}
          >
            <Clock3 size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={{ color: colors.subtext, textTransform: 'capitalize', fontWeight: '700' }}>{name}</Text>
            <Text style={{ color: colors.text, marginTop: 4, fontSize: 18, fontWeight: '900' }}>{time}</Text>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}
