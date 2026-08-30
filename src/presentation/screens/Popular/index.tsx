// camada: presentation — View burra: consome estado pronto do hook.

import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Movie } from '@domain/entities/movie';
import { useAppTheme } from '@hooks/useAppTheme';
import { MovieCard } from '@presentation/components/MovieCard';
import { StateView } from '@presentation/components/StateView';
import { coordinator } from '@routes/navigation';
import { useIsFavorite } from '@store/useFavoritesStore';
import { usePopular } from './hooks/usePopular';
import { createStyles } from './styles';

function PopularMovieItem({
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

export function PopularScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { state, reload, loadMore, toggleFavorite } = usePopular();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Populares</Text>
      <StateView state={state} onRetry={reload}>
        {(movies: Movie[]) => (
          <FlatList
            data={movies}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <PopularMovieItem movie={item} onToggleFavorite={toggleFavorite} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
          />
        )}
      </StateView>
    </SafeAreaView>
  );
}
