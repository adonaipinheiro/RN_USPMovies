import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainTabs } from '@routes/stack/MainTabs.routes';
import { container } from '@di/container';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

describe('MainTabs', () => {
  it('renderiza as três abas de navegação', async () => {
    void container; // garante que o mock acima é usado
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { getAllByText, getByText } = await render(
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <MainTabs />
        </NavigationContainer>
      </QueryClientProvider>,
    );

    await waitFor(() => expect(getAllByText('Populares').length).toBeGreaterThan(0));
    expect(getByText('Buscar')).toBeTruthy();
    expect(getByText('Favoritos')).toBeTruthy();
  });
});
