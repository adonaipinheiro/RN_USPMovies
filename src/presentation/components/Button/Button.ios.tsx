// camada: presentation — variante iOS: opacidade no press, sem ripple
// (o Material ripple do Android não existe nas guidelines da Apple).

import React from 'react';
import { Pressable, Text } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { ButtonProps } from './types';
import { createStyles } from './styles';

export function Button({ label, onPress }: ButtonProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
