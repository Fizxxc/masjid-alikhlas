import { Text, View } from 'react-native';

export function PrayerCard({ name, time }: { name: string; time: string }) {
  return (
    <View style={{ backgroundColor: '#f0fdf4', borderRadius: 18, padding: 16 }}>
      <Text style={{ fontWeight: '700', textTransform: 'capitalize' }}>{name}</Text>
      <Text style={{ marginTop: 6, fontSize: 18 }}>{time}</Text>
    </View>
  );
}
