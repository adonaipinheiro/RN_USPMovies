import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FavoritesScreen } from '@presentation/screens/Favorites';
import { container } from '@di/container';
import { useFavoritesStore } from '@store/useFavoritesStore';
import { useThemeStore } from '@store/useThemeStore';
import { coordinator } from '@routes/navigation';
import { createMovie } from '@mocks/movieFixture';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

const mockedContainer = container as unknown as {
  getFavorites: jest.Mock;
  toggleFavorite: jest.Mock;
};

const movie = createMovie();
const movie2 = createMovie({ id: 2, title: 'Matrix Reloaded' });

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

  it('navega para o detalhe ao tocar em um card e renderiza o separador entre itens', async () => {
    mockedContainer.getFavorites.mockReturnValue([movie, movie2]);
    useFavoritesStore.setState({
      favorites: {
        1: { movie, addedAt: Date.now() },
        2: { movie: movie2, addedAt: Date.now() },
      },
    });
    const gotToDetail = jest.spyOn(coordinator, 'gotToDetail').mockImplementation(() => {});

    const { getByText } = await render(<FavoritesScreen />);

    expect(getByText('Matrix Reloaded')).toBeTruthy();
    fireEvent.press(getByText('Matrix'));

    expect(gotToDetail).toHaveBeenCalledWith(1);
    gotToDetail.mockRestore();
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
