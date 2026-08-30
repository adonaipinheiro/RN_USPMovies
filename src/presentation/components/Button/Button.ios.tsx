// camada: presentation — variante iOS: opacidade no press, sem ripple
// (o Material ripple do Android não existe nas guidelines da Apple).

import React from 'react';
import { Pressable, Text } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { ButtonProps } from './types';
import { createStyles } from './styles';

// Extraída à parte para ser testável diretamente: o estado "pressed" do
// Pressable vem do responder nativo de toque, que o test renderer não simula.
export const resolvePressableStyle =
  (styles: ReturnType<typeof createStyles>) =>
  ({ pressed }: { pressed: boolean }) => [styles.button, pressed && styles.pressed];

export function Button({ label, onPress }: ButtonProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable onPress={onPress} style={resolvePressableStyle(styles)}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
