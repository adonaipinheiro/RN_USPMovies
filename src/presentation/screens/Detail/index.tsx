// camada: presentation — View burra: consome estado pronto do hook.

import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Movie, moviePosterUrl } from '@domain/entities/movie';
import { useAppTheme } from '@hooks/useAppTheme';
import { FavButton } from '@presentation/components/FavButton';
import { StateView } from '@presentation/components/StateView';
import { coordinator } from '@routes/navigation';
import { useDetail } from './hooks/useDetail';
import { createStyles } from './styles';

export function DetailScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { state, isFavorite, retry, toggleFavorite } = useDetail();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.backButton} onPress={coordinator.goBack}>
          ‹ Voltar
        </Text>
        <FavButton isFavorite={isFavorite} onToggle={toggleFavorite} />
      </View>
      <StateView state={state} onRetry={retry}>
        {(movie: Movie) => {
          const posterUrl = moviePosterUrl(movie);
          return (
            <ScrollView contentContainerStyle={styles.content}>
              {posterUrl ? <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" /> : null}
              <View style={styles.infoCard}>
                <Text style={styles.movieTitle}>{movie.title}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.metaText}>{movie.voteAverage.toFixed(1)}</Text>
                  {movie.releaseYear ? <Text style={styles.metaTextSecondary}> · {movie.releaseYear}</Text> : null}
                </View>
              </View>
              {movie.genres.length > 0 ? (
                <View style={styles.genresRow}>
                  {movie.genres.map(genre => (
                    <View key={genre} style={styles.genreChip}>
                      <Text style={styles.genreText}>{genre}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
              <Text style={styles.overview}>{movie.overview}</Text>
            </ScrollView>
          );
        }}
      </StateView>
    </SafeAreaView>
  );
}
