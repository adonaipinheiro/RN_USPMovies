// camada: presentation (navegação) — monta o NavigationContainer raiz,
// injetando o tema (theme/) e a pilha principal (stack/).

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './navigation';
import { MainStack } from './stack/MainStack.routes';
import { useAppNavigationTheme } from './theme';

export function Router() {
  const theme = useAppNavigationTheme();

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      <MainStack />
    </NavigationContainer>
  );
}
