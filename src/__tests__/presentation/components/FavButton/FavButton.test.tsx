import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FavButton } from '@presentation/components/FavButton';

describe('FavButton', () => {
  it('mostra o coração vazio quando não é favorito', async () => {
    const { getByText } = await render(<FavButton isFavorite={false} onToggle={jest.fn()} />);
    expect(getByText('♡')).toBeTruthy();
  });

  it('mostra o coração cheio quando é favorito', async () => {
    const { getByText } = await render(<FavButton isFavorite onToggle={jest.fn()} />);
    expect(getByText('♥')).toBeTruthy();
  });

  it('dispara onToggle ao tocar', async () => {
    const onToggle = jest.fn();
    const { getByText } = await render(<FavButton isFavorite={false} onToggle={onToggle} />);

    fireEvent.press(getByText('♡'));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
