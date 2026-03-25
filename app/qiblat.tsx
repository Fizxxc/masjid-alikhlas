import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { Screen } from '@/src/components/Screen';

const KAABA = {
  lat: 21.4225,
  lng: 39.8262,
};

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function toDeg(value: number) {
  return (value * 180) / Math.PI;
}

function getQiblaBearing(lat: number, lng: number) {
  const phiK = toRad(KAABA.lat);
  const lambdaK = toRad(KAABA.lng);
  const phi = toRad(lat);
  const lambda = toRad(lng);

  const y = Math.sin(lambdaK - lambda);
  const x =
    Math.cos(phi) * Math.tan(phiK) -
    Math.sin(phi) * Math.cos(lambdaK - lambda);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function formatDateTime(date: Date) {
  return {
    time: new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date),
    date: new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date),
  };
}

export default function QiblatScreen() {
  const [now, setNow] = useState(new Date());
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [heading, setHeading] = useState(0);
  const [permissionError, setPermissionError] = useState('');
  const [sensorReady, setSensorReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let magnetometerSub: { remove: () => void } | null = null;

    async function init() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setPermissionError('Izin lokasi ditolak. Aktifkan lokasi untuk arah kiblat yang akurat.');
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setCoords(pos.coords);

        if (Platform.OS === 'web') {
          setSensorReady(false);
          return;
        }

        Magnetometer.setUpdateInterval(500);

        magnetometerSub = Magnetometer.addListener((data) => {
          const angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          const normalized = (angle + 360) % 360;
          setHeading(normalized);
        });

        setSensorReady(true);
      } catch (error) {
        setPermissionError('Gagal mengakses sensor atau lokasi perangkat.');
        console.warn('Qiblat init error:', error);
      }
    }

    init();

    return () => {
      if (magnetometerSub) {
        magnetometerSub.remove();
      }
    };
  }, []);

  const qiblaBearing = useMemo(() => {
    if (!coords) return null;
    return getQiblaBearing(coords.latitude, coords.longitude);
  }, [coords]);

  const arrowRotation = useMemo(() => {
    if (qiblaBearing == null) return 0;
    return (qiblaBearing - heading + 360) % 360;
  }, [qiblaBearing, heading]);

  const { time, date } = formatDateTime(now);

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: '800' }}>Arah Kiblat</Text>
      <Text style={{ color: '#6b7280' }}>{date}</Text>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{time}</Text>

      {permissionError ? (
        <View
          style={{
            backgroundColor: '#fff7ed',
            padding: 16,
            borderRadius: 18,
            marginTop: 8,
          }}
        >
          <Text style={{ color: '#9a3412', fontWeight: '700' }}>
            {permissionError}
          </Text>
        </View>
      ) : null}

      <View
        style={{
          marginTop: 12,
          backgroundColor: '#f0fdf4',
          borderRadius: 24,
          padding: 20,
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View
          style={{
            width: 240,
            height: 240,
            borderRadius: 999,
            borderWidth: 10,
            borderColor: '#16a34a',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <View
            style={{
              transform: [{ rotate: `${arrowRotation}deg` }],
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 88 }}>↑</Text>
          </View>
        </View>

        <Text style={{ fontSize: 16 }}>
          {qiblaBearing != null
            ? `Arah kiblat: ${qiblaBearing.toFixed(1)}°`
            : 'Menghitung arah kiblat...'}
        </Text>

        {coords ? (
          <Text style={{ color: '#4b5563', textAlign: 'center' }}>
            Lokasi kamu: {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
          </Text>
        ) : null}

        {Platform.OS === 'web' ? (
          <View
            style={{
              backgroundColor: '#eff6ff',
              padding: 14,
              borderRadius: 16,
              width: '100%',
            }}
          >
            <Text style={{ color: '#1d4ed8', fontWeight: '700' }}>
              Mode web
            </Text>
            <Text style={{ color: '#1e3a8a', marginTop: 6 }}>
              Browser tidak memakai sensor kompas native seperti di Android/iPhone.
              Untuk arah kiblat realtime yang akurat, buka halaman ini dari app di HP.
            </Text>
          </View>
        ) : (
          <Text style={{ color: '#4b5563', textAlign: 'center' }}>
            {sensorReady
              ? 'Putar perangkat sampai panah mengarah ke atas layar.'
              : 'Menyiapkan sensor kompas...'}
          </Text>
        )}

        <Pressable
          onPress={async () => {
            try {
              const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
              });
              setCoords(pos.coords);
            } catch (error) {
              console.warn('Refresh lokasi gagal:', error);
            }
          }}
          style={{
            backgroundColor: '#16a34a',
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderRadius: 14,
            minWidth: 180,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>
            Refresh Lokasi
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}