/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  // 3 níveis acima: src/__tests__/e2e -> raiz do projeto.
  rootDir: '../../..',
  // Mesmo motivo do jest.config.js da raiz: o watchman desta máquina não
  // consegue criar seu diretório de estado (~/.local/state/watchman) e mata o
  // processo do Jest na largada. A suíte E2E não usa watch mode, então o
  // crawler nativo do Jest resolve.
  watchman: false,
  testMatch: ['<rootDir>/src/__tests__/e2e/**/*.e2e.ts'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
};
