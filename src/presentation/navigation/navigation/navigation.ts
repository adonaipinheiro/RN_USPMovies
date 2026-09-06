// camada: presentation (navegação) — wrapper fino e imperativo sobre a API
// do React Navigation, usado pelo coordinator para navegar sem acoplar as
// telas diretamente à lib de navegação.

import { createRef } from 'react';
import { NavigationContainerRef, StackActions } from '@react-navigation/native';
import type { MainStackParams } from '../stack/MainStack.routes';

export const navigationRef = createRef<NavigationContainerRef<MainStackParams>>();

export const navigation = {
  replace: (to: string, params?: { [key: string]: unknown }) => {
    navigationRef.current?.dispatch(StackActions.replace(to, params));
  },
  push: (to: string, params?: { [key: string]: unknown }) => {
    navigationRef.current?.dispatch(StackActions.push(to, params));
  },
  goBack: () => {
    if (navigationRef.current?.canGoBack()) {
      navigationRef.current?.goBack();
    }
  },
};
