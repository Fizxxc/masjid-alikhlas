import { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/src/hooks/useAppTheme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 36;

export type SlideItem = {
  id: string;
  title?: string | null;
  image_url: string;
};

export default function AutoSlider({ slides }: { slides: SlideItem[] }) {
  const ref = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const { colors } = useAppTheme();

  const safeSlides = useMemo(() => slides?.filter((item) => !!item?.image_url) ?? [], [slides]);

  useEffect(() => {
    if (safeSlides.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % safeSlides.length;
        ref.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [safeSlides]);

  if (!safeSlides.length) return null;

  return (
    <View style={{ gap: 12 }}>
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 18 }}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
          setIndex(newIndex);
        }}
      >
        {safeSlides.map((slide) => (
          <View key={slide.id} style={{ width: CARD_WIDTH, marginRight: 12 }}>
            <View style={{ borderRadius: 28, overflow: 'hidden', height: 220 }}>
              <Image source={{ uri: slide.image_url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.65)']}
                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 18, paddingTop: 44 }}
              >
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>
                  {slide.title || 'Masjid Al-Ikhlas'}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>
                  Informasi, jadwal, dan layanan jamaah dalam satu aplikasi.
                </Text>
              </LinearGradient>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        {safeSlides.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === index ? 22 : 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: i === index ? colors.primary : colors.border,
            }}
          />
        ))}
      </View>
    </View>
  );
}
