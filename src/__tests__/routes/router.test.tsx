import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from '@routes/router';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

describe('Router', () => {
  it('renderiza a navegação principal dentro do NavigationContainer', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { getAllByText } = await render(
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>,
    );

    await waitFor(() => expect(getAllByText('Populares').length).toBeGreaterThan(0));
  });
});
