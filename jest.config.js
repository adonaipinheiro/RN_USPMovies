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
    '!src/repositories/dto/**',
    '!src/presentation/components/Button/index.ts',
    '!src/presentation/components/Button/types.ts',
    '!src/presentation/screens/index.ts',
    '!src/presentation/state/uiState.ts',
    '!src/routes/index.ts',
    '!src/routes/navigation/index.ts',
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
