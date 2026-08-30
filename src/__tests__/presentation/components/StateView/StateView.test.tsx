import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { StateView } from '@presentation/components/StateView';
import { UiState } from '@presentation/state/uiState';

describe('StateView', () => {
  it('mostra o indicador de carregamento no estado "loading"', async () => {
    const state: UiState<string> = { type: 'loading' };
    const { toJSON } = await render(
      <StateView state={state} onRetry={jest.fn()}>
        {value => <Text>{value}</Text>}
      </StateView>,
    );

    expect(toJSON()).toBeTruthy();
  });

  it('renderiza o children no estado "data"', async () => {
    const state: UiState<string> = { type: 'data', value: 'conteúdo' };
    const { getByText } = await render(
      <StateView state={state} onRetry={jest.fn()}>
        {value => <Text>{value}</Text>}
      </StateView>,
    );

    expect(getByText('conteúdo')).toBeTruthy();
  });

  it('mostra a mensagem padrão no estado "empty"', async () => {
    const state: UiState<string> = { type: 'empty' };
    const { getByText } = await render(
      <StateView state={state} onRetry={jest.fn()}>
        {value => <Text>{value}</Text>}
      </StateView>,
    );

    expect(getByText('Nada por aqui')).toBeTruthy();
    expect(getByText('Não há filmes para mostrar no momento.')).toBeTruthy();
  });

  it('aceita uma mensagem customizada para o estado "empty"', async () => {
    const state: UiState<string> = { type: 'empty' };
    const { getByText } = await render(
      <StateView state={state} onRetry={jest.fn()} emptyMessage="Mensagem customizada">
        {value => <Text>{value}</Text>}
      </StateView>,
    );

    expect(getByText('Mensagem customizada')).toBeTruthy();
  });

  it('mostra a mensagem de erro e dispara onRetry ao tocar no botão', async () => {
    const onRetry = jest.fn();
    const state: UiState<string> = { type: 'error', message: 'Falha de rede' };
    const { getByText } = await render(
      <StateView state={state} onRetry={onRetry}>
        {value => <Text>{value}</Text>}
      </StateView>,
    );

    expect(getByText('Falha de rede')).toBeTruthy();
    fireEvent.press(getByText('Tentar novamente'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
