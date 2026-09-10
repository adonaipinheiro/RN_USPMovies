// camada: presentation — View burra, só renderiza o que recebe.

import React from 'react';
import { Pressable, Text } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { createStyles } from './styles';

interface FavButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  testID?: string;
}

export function FavButton({ isFavorite, onToggle, testID }: FavButtonProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      // camada: presentation — accessibilityState.selected reporta o "ligado/
      // desligado" do toggle pro leitor de tela (ex.: "Favorito, selecionado").
      accessibilityState={{ selected: isFavorite }}
      testID={testID ?? 'fav-button'}
    >
      <Text style={[styles.icon, isFavorite && styles.iconActive]}>{isFavorite ? '♥' : '♡'}</Text>
    </Pressable>
  );
}
