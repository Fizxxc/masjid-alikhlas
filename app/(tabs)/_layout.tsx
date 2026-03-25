import { Tabs } from 'expo-router';
import { BookOpen, CalendarDays, FileWarning, House, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#16a34a', tabBarStyle: { height: 64, paddingTop: 6, paddingBottom: 8 } }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }} />
      <Tabs.Screen name="jadwal" options={{ title: 'Jadwal', tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} /> }} />
      <Tabs.Screen name="doa" options={{ title: 'Doa', tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} /> }} />
      <Tabs.Screen name="laporan" options={{ title: 'Laporan', tabBarIcon: ({ color, size }) => <FileWarning color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />
    </Tabs>
  );
}
