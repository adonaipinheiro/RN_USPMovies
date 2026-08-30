// SafeAreaProvider mede o frame via um evento de layout nativo que nunca
// dispara no test renderer, deixando a árvore sem os filhos indefinidamente.
// react-native-safe-area-context já publica um mock oficial para isso.

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);
