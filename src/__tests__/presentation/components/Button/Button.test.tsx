import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button as IosButton, resolvePressableStyle } from '@presentation/components/Button/Button.ios';
import { Button as AndroidButton } from '@presentation/components/Button/Button.android';
import { createStyles } from '@presentation/components/Button/styles';
import { lightColors } from '@utils/colors';

describe('Button', () => {
  it('(iOS) renderiza o label e dispara onPress ao tocar', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<IosButton label="Tentar novamente" onPress={onPress} />);

    fireEvent.press(getByText('Tentar novamente'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('(iOS) resolve o estilo tanto para o estado normal quanto para o "pressed"', () => {
    const styles = createStyles(lightColors);
    const styleFn = resolvePressableStyle(styles);

    expect(styleFn({ pressed: false })).toEqual([styles.button, false]);
    expect(styleFn({ pressed: true })).toEqual([styles.button, styles.pressed]);
  });

  it('(Android) renderiza o label e dispara onPress ao tocar', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<AndroidButton label="Tentar novamente" onPress={onPress} />);

    fireEvent.press(getByText('Tentar novamente'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
