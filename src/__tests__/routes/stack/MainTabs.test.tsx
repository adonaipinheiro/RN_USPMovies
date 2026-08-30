import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MainTabs } from '@routes/stack/MainTabs.routes';
import { container } from '@di/container';
import { createQueryClientWrapper } from '@mocks/queryClientWrapper';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

describe('MainTabs', () => {
  it('renderiza as três abas de navegação', async () => {
    void container; // garante que o mock acima é usado
    const Wrapper = createQueryClientWrapper();
    const { getAllByText, getByText } = await render(
      <Wrapper>
        <NavigationContainer>
          <MainTabs />
        </NavigationContainer>
      </Wrapper>,
    );

    await waitFor(() => expect(getAllByText('Populares').length).toBeGreaterThan(0));
    expect(getByText('Buscar')).toBeTruthy();
    expect(getByText('Favoritos')).toBeTruthy();
  });
});
