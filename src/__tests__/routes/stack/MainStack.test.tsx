import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainStack } from '@routes/stack/MainStack.routes';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

describe('MainStack', () => {
  it('renderiza a tela de Tabs por padrão', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { getAllByText } = await render(
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </QueryClientProvider>,
    );

    await waitFor(() => expect(getAllByText('Populares').length).toBeGreaterThan(0));
  });
});
