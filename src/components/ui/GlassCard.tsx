import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export function GlassCard({
  children,
  style,
  intensity = 55,
}: PropsWithChildren<{ style?: ViewStyle | ViewStyle[]; intensity?: number }>) {
  const { colors, isDark } = useAppTheme();

  return (
    <View style={[styles.wrapper, { shadowColor: colors.shadow }, style]}>
      <BlurView
        intensity={intensity}
        tint={isDark ? 'dark' : 'light'}
        style={[
          styles.blur,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 8,
  },
  blur: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
});
