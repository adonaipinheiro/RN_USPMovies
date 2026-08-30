// camada: presentation — View burra, só renderiza o que recebe.

import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Movie, moviePosterUrl } from '@domain/entities/movie';
import { useAppTheme } from '@hooks/useAppTheme';
import { FavButton } from '@presentation/components/FavButton';
import { createStyles } from './styles';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function MovieCard({ movie, isFavorite, onPress, onToggleFavorite }: MovieCardProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const posterUrl = moviePosterUrl(movie);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {posterUrl ? (
        <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
      ) : (
        <View style={styles.poster} />
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.metaText}>{movie.voteAverage.toFixed(1)}</Text>
          {movie.releaseYear ? <Text style={styles.metaTextSecondary}> · {movie.releaseYear}</Text> : null}
        </View>
        <Text style={styles.overview} numberOfLines={2}>
          {movie.overview}
        </Text>
      </View>
      <FavButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
    </TouchableOpacity>
  );
}
