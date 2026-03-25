import { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import { Slide } from '@/src/types/db';

const { width } = Dimensions.get('window');

export function AutoSlider({ slides }: { slides: Slide[] }) {
  const ref = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const id = setInterval(() => {
      const next = (index + 1) % slides.length;
      ref.current?.scrollTo({ x: next * (width - 32), animated: true });
      setIndex(next);
    }, 3000);
    return () => clearInterval(id);
  }, [index, slides.length]);

  return (
    <View>
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
          setIndex(newIndex);
        }}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width: width - 32, marginRight: 12 }}>
            <Image source={{ uri: slide.image_url }} style={{ width: '100%', height: 220, borderRadius: 24 }} />
            {!!slide.title && <Text style={{ marginTop: 8, fontSize: 18, fontWeight: '700' }}>{slide.title}</Text>}
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 10 }}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === index ? 18 : 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: i === index ? '#16a34a' : '#d1d5db',
            }}
          />
        ))}
      </View>
    </View>
  );
}
