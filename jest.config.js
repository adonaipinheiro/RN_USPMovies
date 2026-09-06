module.exports = {
  preset: '@react-native/jest-preset',
  watchman: false,
  // Bibliotecas nativas (MMKV, React Query) deixam timers/handles internos
  // pendentes mesmo com os mocks; forceExit evita que o processo do Jest
  // fique pendurado depois que todos os testes já passaram.
  forceExit: true,
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|@react-navigation|react-native-.*)/)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/__tests__/__mocks__/',
    '<rootDir>/src/__tests__/setup/',
    // specs *.e2e.ts rodam sob o Detox (e2e/jest.config.js), não aqui — têm
    // seus próprios globais (device, element, expect...) que colidiriam com
    // os do Jest/testing-library usados nos testes unitários.
    '<rootDir>/e2e/',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/__tests__/setup/reactQuery.setup.ts',
    '<rootDir>/src/__tests__/setup/safeArea.setup.ts',
  ],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
    '!src/@types/**',
    // arquivos só de tipos/interfaces ou barris de re-export puro: sem
    // lógica de runtime para cobrir (o contrato já é validado pelo
    // typecheck e pelos testes de quem os implementa/consome).
    '!src/domain/repositories/**',
    '!src/data/remote/dto/**',
    '!src/presentation/components/Button/index.ts',
    '!src/presentation/components/Button/types.ts',
    '!src/presentation/screens/index.ts',
    '!src/presentation/state/uiState.ts',
    '!src/presentation/navigation/index.ts',
    '!src/presentation/navigation/navigation/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
