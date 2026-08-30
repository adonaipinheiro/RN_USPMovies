import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Router } from '@routes/router';
import { createQueryClientWrapper } from '@mocks/queryClientWrapper';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

describe('Router', () => {
  it('renderiza a navegação principal dentro do NavigationContainer', async () => {
    const Wrapper = createQueryClientWrapper();
    const { getAllByText } = await render(
      <Wrapper>
        <Router />
      </Wrapper>,
    );

    await waitFor(() => expect(getAllByText('Populares').length).toBeGreaterThan(0));
  });
});
