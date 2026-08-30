import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppTheme } from '@hooks/useAppTheme';
import { FavoritesScreen, PopularScreen, SearchScreen } from '@presentation/screens';

export const MainTabsScreenNames = {
  Popular: 'Popular',
  Search: 'Search',
  Favorites: 'Favorites',
} as const;

export type MainTabsParams = {
  [MainTabsScreenNames.Popular]: undefined;
  [MainTabsScreenNames.Search]: undefined;
  [MainTabsScreenNames.Favorites]: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParams>();

function TabIcon({ symbol, color }: { symbol: string; color: string }) {
  return <Text style={{ fontSize: 18, color }}>{symbol}</Text>;
}

export function MainTabs() {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name={MainTabsScreenNames.Popular}
        component={PopularScreen}
        options={{
          tabBarLabel: 'Populares',
          tabBarIcon: ({ color }) => <TabIcon symbol="🔥" color={color} />,
        }}
      />
      <Tab.Screen
        name={MainTabsScreenNames.Search}
        component={SearchScreen}
        options={{
          tabBarLabel: 'Buscar',
          tabBarIcon: ({ color }) => <TabIcon symbol="🔍" color={color} />,
        }}
      />
      <Tab.Screen
        name={MainTabsScreenNames.Favorites}
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color }) => <TabIcon symbol="♥" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
