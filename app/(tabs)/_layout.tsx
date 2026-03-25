import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { BookOpen, CalendarDays, FileWarning, House, User } from 'lucide-react-native';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export default function TabsLayout() {
  const { colors, isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: 2 },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 18,
          height: 74,
          paddingTop: 10,
          paddingBottom: 10,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          borderRadius: 26,
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            tint={isDark ? 'dark' : 'light'}
            intensity={55}
            style={{
              flex: 1,
              borderRadius: 26,
              overflow: 'hidden',
              backgroundColor: colors.tab,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          />
        ),
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }} />
      <Tabs.Screen name="jadwal" options={{ title: 'Jadwal', tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} /> }} />
      <Tabs.Screen name="doa" options={{ title: 'Doa', tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} /> }} />
      <Tabs.Screen name="laporan" options={{ title: 'Laporan', tabBarIcon: ({ color, size }) => <FileWarning color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />
    </Tabs>
  );
}
