// camada: presentation (navegação) — abas principais (Populares/Buscar/Favoritos).

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

// camada: presentation (navegação) — os tabBarButtonTestID existem para os testes
// E2E: selecionar a aba por texto é ambíguo (o label "Buscar" também é o
// título da tela de busca) e frágil logo após um reload, quando a tab bar
// ainda não montou. O testID é estável nos dois casos.

// camada: presentation (navegação) — o emoji é puramente decorativo (o
// tabBarLabel ao lado já diz "Populares"/"Buscar"/"Favoritos"); escondê-lo do
// leitor de tela evita que ele anuncie o símbolo duas vezes por aba.
function TabIcon({ symbol, color }: { symbol: string; color: string }) {
  return (
    <Text style={{ fontSize: 18, color }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {symbol}
    </Text>
  );
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
          tabBarAccessibilityLabel: 'Aba Populares, filmes em alta',
          tabBarButtonTestID: 'tab-popular',
          tabBarIcon: ({ color }) => <TabIcon symbol="🔥" color={color} />,
        }}
      />
      <Tab.Screen
        name={MainTabsScreenNames.Search}
        component={SearchScreen}
        options={{
          tabBarLabel: 'Buscar',
          tabBarAccessibilityLabel: 'Aba Buscar filmes',
          tabBarButtonTestID: 'tab-search',
          tabBarIcon: ({ color }) => <TabIcon symbol="🔍" color={color} />,
        }}
      />
      <Tab.Screen
        name={MainTabsScreenNames.Favorites}
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarAccessibilityLabel: 'Aba Favoritos',
          tabBarButtonTestID: 'tab-favorites',
          tabBarIcon: ({ color }) => <TabIcon symbol="♥" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
