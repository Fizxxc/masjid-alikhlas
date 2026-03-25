import { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export const AppInput = forwardRef<TextInput, TextInputProps & { label?: string }>(function AppInput(
  { label, style, placeholderTextColor, ...props },
  ref
) {
  const { colors } = useAppTheme();

  return (
    <View style={{ gap: 8 }}>
      {label ? <Text style={{ color: colors.subtext, fontWeight: '700', fontSize: 13 }}>{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor={placeholderTextColor || colors.subtext}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.input,
          },
          style,
        ]}
        {...props}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
});
