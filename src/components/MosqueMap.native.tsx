import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import { DEFAULT_MOSQUE } from '@/src/lib/constants';
import { GlassCard } from '@/src/components/ui/GlassCard';

export default function MosqueMap() {
  return (
    <GlassCard intensity={45}>
      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '800', fontSize: 16 }}>Lokasi Masjid Al-Ikhlas</Text>
        <View style={styles.container}>
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: DEFAULT_MOSQUE.latitude,
              longitude: DEFAULT_MOSQUE.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
          >
            <Marker
              coordinate={{ latitude: DEFAULT_MOSQUE.latitude, longitude: DEFAULT_MOSQUE.longitude }}
              title="Masjid Al-Ikhlas"
              description="Lokasi utama masjid"
            />
          </MapView>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 230,
    borderRadius: 22,
    overflow: 'hidden',
  },
});
