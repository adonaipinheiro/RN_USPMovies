// camada: presentation — View burra: consome estado pronto do hook.

import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Movie } from '@domain/entities/movie';
import { useAppTheme } from '@hooks/useAppTheme';
import { MovieCard } from '@presentation/components/MovieCard';
import { StateView } from '@presentation/components/StateView';
import { coordinator } from '@routes/navigation';
import { ThemeMode } from '@store/useThemeStore';
import { useIsFavorite } from '@store/useFavoritesStore';
import { useFavorites } from './hooks/useFavorites';
import { createStyles } from './styles';

function FavoriteMovieItem({
  movie,
  onToggleFavorite,
}: {
  movie: Movie;
  onToggleFavorite: (movie: Movie) => void;
}) {
  const isFavorite = useIsFavorite(movie.id);
  return (
    <MovieCard
      movie={movie}
      isFavorite={isFavorite}
      onPress={() => coordinator.gotToDetail(movie.id)}
      onToggleFavorite={() => onToggleFavorite(movie)}
    />
  );
}

const THEME_OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: 'system', label: 'Sistema' },
  { mode: 'light', label: 'Claro' },
  { mode: 'dark', label: 'Escuro' },
];

function ThemeToggle() {
  const { mode, setMode } = useAppTheme();
  const styles = createStyles(useAppTheme().colors);

  return (
    <View style={styles.themeRow}>
      {THEME_OPTIONS.map(option => {
        const active = option.mode === mode;
        return (
          <Pressable
            key={option.mode}
            onPress={() => setMode(option.mode)}
            style={[styles.themeOption, active && styles.themeOptionActive]}
          >
            <Text style={[styles.themeOptionText, active && styles.themeOptionTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function FavoritesScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { state, toggleFavorite } = useFavorites();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Favoritos</Text>
      <StateView state={state} onRetry={() => {}} emptyMessage="Favorite um filme para vê-lo aqui.">
        {(movies: Movie[]) => (
          <FlatList
            data={movies}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <FavoriteMovieItem movie={item} onToggleFavorite={toggleFavorite} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
          />
        )}
      </StateView>
      <ThemeToggle />
    </SafeAreaView>
  );
}
