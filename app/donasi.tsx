import { Text, View } from 'react-native';
import { Screen } from '@/src/components/Screen';

export default function DonasiScreen() {
  return (
    <Screen>
      <View style={{ backgroundColor: '#f0fdf4', borderRadius: 18, padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '800' }}>Donasi</Text>
        <Text style={{ marginTop: 8 }}>Coming soon. Fitur donasi akan segera tersedia.</Text>
      </View>
    </Screen>
  );
}
