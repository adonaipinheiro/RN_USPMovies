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
