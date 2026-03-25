import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export function Screen({
  children,
  scroll = true,
}: PropsWithChildren<{ scroll?: boolean }>) {
  const { isDark } = useAppTheme();

  const inner = (
    <View style={styles.content}>
      {children}
    </View>
  );

  const content = scroll ? (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {inner}
    </ScrollView>
  ) : (
    <View style={styles.nonScrollContent}>{inner}</View>
  );

  return (
    <LinearGradient
      colors={
        isDark
          ? ['#06100c', '#071510', '#0b1d16']
          : ['#edf7f0', '#f6fbf7', '#e7f6ec']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.fill}
    >
      <SafeAreaView style={styles.fill}>{content}</SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 130,
  },
  nonScrollContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 130,
  },
  content: {
    gap: 16,
  },
});