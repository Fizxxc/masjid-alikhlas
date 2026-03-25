import { Linking, Platform, Pressable, Text, View } from 'react-native';
import { DEFAULT_MOSQUE } from '@/src/lib/constants';

export function MosqueMap() {
  const url = `https://www.google.com/maps/search/?api=1&query=${DEFAULT_MOSQUE.latitude},${DEFAULT_MOSQUE.longitude}`;

  if (Platform.OS === 'web') {
    return (
      <View style={{ gap: 10 }}>
        <View style={{ backgroundColor: '#f8fafc', borderRadius: 20, padding: 18, gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>Lokasi Masjid Al-Ikhlas</Text>
          <Text>Koordinat: {DEFAULT_MOSQUE.latitude}, {DEFAULT_MOSQUE.longitude}</Text>
          <Text>Tampilan peta interaktif tersedia di Android/iOS build. Untuk web, buka lokasi melalui Google Maps.</Text>
        </View>
        <Pressable onPress={() => Linking.openURL(url)} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14 }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Buka di Google Maps</Text>
        </Pressable>
      </View>
    );
  }

  const MapComponents = require('react-native-maps');
  const MapView = MapComponents.default;
  const Marker = MapComponents.Marker;

  return (
    <View style={{ gap: 10 }}>
      <MapView
        style={{ height: 220, borderRadius: 20 }}
        initialRegion={{
          latitude: DEFAULT_MOSQUE.latitude,
          longitude: DEFAULT_MOSQUE.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: DEFAULT_MOSQUE.latitude, longitude: DEFAULT_MOSQUE.longitude }}
          title="Masjid Al-Ikhlas"
          description="Lokasi masjid"
        />
      </MapView>
      <Pressable onPress={() => Linking.openURL(url)} style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 14 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Buka di Google Maps</Text>
      </Pressable>
    </View>
  );
}
