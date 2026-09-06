// camada: presentation — variante Android: ripple Material, do jeito que o
// usuário Android espera ao tocar num botão.

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { ButtonProps } from './types';
import { createStyles } from './styles';

export function Button({ label, onPress, testID }: ButtonProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: colors.border }}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel={label}
        testID={testID}
      >
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
}
