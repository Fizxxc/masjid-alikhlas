import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { Screen } from '@/src/components/Screen';
import { getQiblaBearing } from '@/src/utils/kiblat';

export default function QiblatScreen() {
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      setCoords(pos.coords);
    })();

    const subscription = Magnetometer.addListener((data) => {
      const angle = Math.atan2(data.y, data.x) * 180 / Math.PI;
      setHeading((angle + 360) % 360);
    });

    return () => subscription.remove();
  }, []);

  const qibla = useMemo(() => coords ? getQiblaBearing(coords.latitude, coords.longitude) : 0, [coords]);
  const rotate = (qibla - heading + 360) % 360;

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: '800', textAlign: 'center' }}>Arah Kiblat</Text>
      <View style={{ alignItems: 'center', marginTop: 30, gap: 20 }}>
        <View style={{ width: 240, height: 240, borderRadius: 999, borderWidth: 8, borderColor: '#16a34a', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: `${rotate}deg` }] }}>
          <Text style={{ fontSize: 80 }}>↑</Text>
        </View>
        <Text>Heading kompas: {heading.toFixed(1)}°</Text>
        <Text>Arah kiblat: {qibla.toFixed(1)}°</Text>
        <Text style={{ textAlign: 'center' }}>Kalibrasi kompas jika arah belum akurat dengan menggerakkan HP membentuk angka delapan.</Text>
      </View>
    </Screen>
  );
}
