// camada: presentation — View burra: consome estado pronto do hook.

import React from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Movie } from '@domain/entities/movie';
import { useAppTheme } from '@hooks/useAppTheme';
import { MovieCard } from '@presentation/components/MovieCard';
import { StateView } from '@presentation/components/StateView';
import { coordinator } from '@routes/navigation';
import { useIsFavorite } from '@store/useFavoritesStore';
import { useSearch } from './hooks/useSearch';
import { createStyles } from './styles';

function SearchMovieItem({
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

export function SearchScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { query, setQuery, isSearching, state, retry, toggleFavorite } = useSearch();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Buscar</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Título do filme"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        autoCorrect={false}
      />
      {!isSearching ? (
        <View style={styles.hint}>
          <Text style={styles.hintTitle}>Buscar filmes</Text>
          <Text style={styles.hintMessage}>Digite um título para começar.</Text>
        </View>
      ) : (
        <StateView state={state} onRetry={retry}>
          {(movies: Movie[]) => (
            <FlatList
              data={movies}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => <SearchMovieItem movie={item} onToggleFavorite={toggleFavorite} />}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.listContent}
            />
          )}
        </StateView>
      )}
    </SafeAreaView>
  );
}
