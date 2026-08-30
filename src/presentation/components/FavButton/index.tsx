// camada: presentation — View burra, só renderiza o que recebe.

import React from 'react';
import { Pressable, Text } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { createStyles } from './styles';

interface FavButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

export function FavButton({ isFavorite, onToggle }: FavButtonProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8}
      style={styles.button}
      accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Text style={[styles.icon, isFavorite && styles.iconActive]}>{isFavorite ? '♥' : '♡'}</Text>
    </Pressable>
  );
}
