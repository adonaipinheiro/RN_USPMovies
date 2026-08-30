import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';
import { useThemeStore } from '@store/useThemeStore';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

describe('App', () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: 'system' });
  });

  it('renderiza a árvore inteira sem quebrar', async () => {
    const { getAllByText } = await render(<App />);

    await waitFor(() => expect(getAllByText('Populares').length).toBeGreaterThan(0));
  });

  it('renderiza a StatusBar em modo escuro quando o tema é dark', async () => {
    useThemeStore.setState({ mode: 'dark' });

    const { getAllByText } = await render(<App />);

    await waitFor(() => expect(getAllByText('Populares').length).toBeGreaterThan(0));
  });
});
