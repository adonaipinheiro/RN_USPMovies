import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MovieCard } from '@presentation/components/MovieCard';
import { createMovie } from '@mocks/movieFixture';

const movie = createMovie({
  posterPath: '/poster.jpg',
  overview: 'Sinopse do filme',
  voteAverage: 8.456,
  genres: ['Ação'],
});

describe('MovieCard', () => {
  it('renderiza título, nota e ano, e dispara onPress ao tocar no card', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(
      <MovieCard movie={movie} isFavorite={false} onPress={onPress} onToggleFavorite={jest.fn()} />,
    );

    expect(getByText('Matrix')).toBeTruthy();
    expect(getByText('8.5')).toBeTruthy();

    fireEvent.press(getByText('Matrix'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('dispara onToggleFavorite ao tocar no coração', async () => {
    const onToggleFavorite = jest.fn();
    const { getByText } = await render(
      <MovieCard movie={movie} isFavorite={false} onPress={jest.fn()} onToggleFavorite={onToggleFavorite} />,
    );

    fireEvent.press(getByText('♡'));

    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('não renderiza o ano quando o filme não tem releaseYear', async () => {
    const { queryByText } = await render(
      <MovieCard
        movie={{ ...movie, releaseYear: null }}
        isFavorite={false}
        onPress={jest.fn()}
        onToggleFavorite={jest.fn()}
      />,
    );

    expect(queryByText(/1999/)).toBeNull();
  });

  it('renderiza um placeholder quando o filme não tem pôster', async () => {
    const { toJSON } = await render(
      <MovieCard
        movie={{ ...movie, posterPath: null }}
        isFavorite={false}
        onPress={jest.fn()}
        onToggleFavorite={jest.fn()}
      />,
    );

    expect(toJSON()).toBeTruthy();
  });
});
