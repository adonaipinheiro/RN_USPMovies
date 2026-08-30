import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button as IosButton } from '@presentation/components/Button/Button.ios';
import { Button as AndroidButton } from '@presentation/components/Button/Button.android';

describe('Button', () => {
  it('(iOS) renderiza o label e dispara onPress ao tocar', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<IosButton label="Tentar novamente" onPress={onPress} />);

    fireEvent.press(getByText('Tentar novamente'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('(iOS) aplica o estilo de "pressed" enquanto o dedo está na tela', async () => {
    const { getByText } = await render(<IosButton label="Tentar novamente" onPress={() => {}} />);
    const label = getByText('Tentar novamente');

    fireEvent(label, 'pressIn');
    fireEvent(label, 'pressOut');
  });

  it('(Android) renderiza o label e dispara onPress ao tocar', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<AndroidButton label="Tentar novamente" onPress={onPress} />);

    fireEvent.press(getByText('Tentar novamente'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
