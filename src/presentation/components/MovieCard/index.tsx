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
  const favoriteActionLabel = isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      testID="movie-card"
      // camada: presentation — o card inteiro é UM elemento de acessibilidade
      // (accessible=true, padrão do TouchableOpacity), então o leitor de tela
      // lê o label abaixo de uma vez, em vez de fragmentar pôster/título/nota.
      // Isso também esconde o FavButton aninhado do foco individual do leitor
      // de tela (limitação conhecida de touchables aninhados em RN) — por
      // isso o toggle de favorito é exposto de novo como accessibilityAction,
      // acessível via rotor (VoiceOver) ou menu de ações (TalkBack).
      accessibilityRole="button"
      accessibilityLabel={`${movie.title}, nota ${movie.voteAverage.toFixed(1)}${movie.releaseYear ? `, ${movie.releaseYear}` : ''}`}
      accessibilityHint="Abre os detalhes do filme"
      accessibilityActions={[{ name: 'toggleFavorite', label: favoriteActionLabel }]}
      onAccessibilityAction={event => {
        if (event.nativeEvent.actionName === 'toggleFavorite') {
          onToggleFavorite();
        }
      }}
    >
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
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
