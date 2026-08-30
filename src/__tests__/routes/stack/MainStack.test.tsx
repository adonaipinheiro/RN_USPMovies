import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MainStack } from '@routes/stack/MainStack.routes';
import { createQueryClientWrapper } from '@mocks/queryClientWrapper';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

describe('MainStack', () => {
  it('renderiza a tela de Tabs por padrão', async () => {
    const Wrapper = createQueryClientWrapper();
    const { getAllByText } = await render(
      <Wrapper>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </Wrapper>,
    );

    await waitFor(() => expect(getAllByText('Populares').length).toBeGreaterThan(0));
  });
});
