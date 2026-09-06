module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.ts', '.android.ts', '.ios.tsx', '.android.tsx', '.ts', '.tsx', '.js', '.json'],
        alias: {
          '@domain': './src/domain',
          '@data': './src/data',
          '@infra': './src/infra',
          '@repository': './src/repository',
          '@di': './src/di',
          '@presentation': './src/presentation',
          '@store': './src/store',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@mocks': './src/__tests__/__mocks__',
        },
      },
    ],
  ],
};
