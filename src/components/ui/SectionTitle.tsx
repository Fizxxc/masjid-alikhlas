import { Text, View } from 'react-native';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  const { colors } = useAppTheme();

  return (
    <View style={{ gap: 4 }}>
      <Text style={{ fontSize: 22, fontWeight: '900', color: colors.text }}>{title}</Text>
      {subtitle ? <Text style={{ color: colors.subtext, lineHeight: 20 }}>{subtitle}</Text> : null}
    </View>
  );
}
