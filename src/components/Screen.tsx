import { PropsWithChildren } from 'react';
import { ScrollView, useColorScheme, View } from 'react-native';
import { palette } from '@/src/lib/constants';

export function Screen({ children, scroll = true }: PropsWithChildren<{ scroll?: boolean }>) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;

  if (scroll) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {children}
      </ScrollView>
    );
  }

  return <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>{children}</View>;
}
