import { ActivityIndicator, Pressable, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  style,
  loading = false,
}: {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
  loading?: boolean;
}) {
  const { colors } = useAppTheme();

  if (variant === 'secondary') {
    return (
      <Pressable
        onPress={onPress}
        style={[
          {
            minHeight: 54,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.card,
          },
          style,
        ]}
      >
        <Text style={{ color: colors.text, fontWeight: '800' }}>{title}</Text>
      </Pressable>
    );
  }

  const gradientColors =
    variant === 'danger'
      ? ['#f87171', '#ef4444']
      : [colors.primary, colors.primaryStrong];

  return (
    <Pressable onPress={onPress} style={style}>
      <LinearGradient
        colors={gradientColors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          minHeight: 56,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.35,
          shadowRadius: 20,
          elevation: 6,
        }}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '800' }}>{title}</Text>}
      </LinearGradient>
    </Pressable>
  );
}
