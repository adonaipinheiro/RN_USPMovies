import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FavoritesScreen } from '@presentation/screens/Favorites';
import { container } from '@di/container';
import { useFavoritesStore } from '@store/useFavoritesStore';
import { useThemeStore } from '@store/useThemeStore';
import { Movie } from '@domain/entities/movie';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

const mockedContainer = container as unknown as {
  getFavorites: jest.Mock;
  toggleFavorite: jest.Mock;
};

const movie: Movie = {
  id: 1,
  title: 'Matrix',
  posterPath: null,
  overview: '',
  voteAverage: 8,
  releaseYear: '1999',
  genres: [],
};

describe('FavoritesScreen', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: {} });
    useThemeStore.setState({ mode: 'system' });
    mockedContainer.getFavorites.mockReset().mockReturnValue([]);
    mockedContainer.toggleFavorite.mockReset();
  });

  it('mostra a mensagem vazia quando não há favoritos', async () => {
    const { getByText } = await render(<FavoritesScreen />);
    expect(getByText('Favorite um filme para vê-lo aqui.')).toBeTruthy();
  });

  it('desfavorita um filme ao tocar no coração', async () => {
    mockedContainer.getFavorites.mockReturnValue([movie]);
    useFavoritesStore.setState({ favorites: { 1: { movie, addedAt: Date.now() } } });

    const { getByText } = await render(<FavoritesScreen />);
    fireEvent.press(getByText('♥'));

    expect(mockedContainer.toggleFavorite).toHaveBeenCalledWith(movie);
  });

  it('lista os favoritos e permite alternar o tema', async () => {
    mockedContainer.getFavorites.mockReturnValue([movie]);
    useFavoritesStore.setState({ favorites: { 1: { movie, addedAt: Date.now() } } });

    const { getByText } = await render(<FavoritesScreen />);

    expect(getByText('Matrix')).toBeTruthy();

    fireEvent.press(getByText('Escuro'));
    fireEvent.press(getByText('Claro'));
    fireEvent.press(getByText('Sistema'));
  });
});
