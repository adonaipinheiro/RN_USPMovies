import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { DetailScreen } from '@presentation/screens';
import { MainTabs } from './MainTabs.routes';

export const MainStackScreenNames = {
  Tabs: 'Tabs',
  Detail: 'Detail',
} as const;

export type MainStackParams = {
  [MainStackScreenNames.Tabs]: undefined;
  [MainStackScreenNames.Detail]: { movieId: number };
};

const MainStackNavigator = createNativeStackNavigator<MainStackParams>();

const tabsScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

const detailScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

export function MainStack() {
  return (
    <MainStackNavigator.Navigator>
      <MainStackNavigator.Screen
        name={MainStackScreenNames.Tabs}
        component={MainTabs}
        options={tabsScreenOptions}
      />
      <MainStackNavigator.Screen
        name={MainStackScreenNames.Detail}
        component={DetailScreen}
        options={detailScreenOptions}
      />
    </MainStackNavigator.Navigator>
  );
}
