import { useColorScheme } from 'react-native';
import { palette } from '@/src/lib/constants';
import { useSettingsStore } from '@/src/store/settings-store';

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const selectedTheme = useSettingsStore((state) => state.theme);

  const mode = selectedTheme === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : selectedTheme;
  const colors = palette[mode];

  return {
    mode,
    colors,
    isDark: mode === 'dark',
  };
}
