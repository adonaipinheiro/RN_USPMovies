// camada: infra (ferramental de teste) — configuração do Detox: onde estão
// os binários do app, como buildá-los e em qual device/emulador rodar. Não
// tem regra de negócio nenhuma, só "encanamento" de execução dos testes E2E.

/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'src/__tests__/e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  // Artefatos (screenshots/vídeo/logs) só quando um teste falha — o suficiente
  // pra depurar sem encher o disco a cada execução.
  artifacts: {
    rootDir: 'artifacts',
    plugins: {
      log: 'failing',
      screenshot: 'failing',
      video: 'none',
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/RN_USPMovies.app',
      build:
        'xcodebuild -workspace ios/RN_USPMovies.xcworkspace -scheme RN_USPMovies ' +
        '-configuration Debug -sdk iphonesimulator -derivedDataPath ios/build ' +
        'CODE_SIGNING_ALLOWED=NO',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/RN_USPMovies.app',
      build:
        'xcodebuild -workspace ios/RN_USPMovies.xcworkspace -scheme RN_USPMovies ' +
        '-configuration Release -sdk iphonesimulator -derivedDataPath ios/build ' +
        'CODE_SIGNING_ALLOWED=NO',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      // O app em debug carrega o bundle do Metro rodando no host: sem esse
      // reverse o emulador não enxerga o localhost:8081 da máquina.
      reversePorts: [8081],
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        // Único simulador instalado nesta máquina (xcrun simctl list devices).
        type: 'iPhone 17',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        // AVD criado localmente no Android Studio. Rode `emulator -list-avds`
        // pra conferir o nome se trocar de máquina.
        avdName: 'Pixel_10',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
  },
};
