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
          '@infra': './src/infra',
          '@repositories': './src/repositories',
          '@presentation': './src/presentation',
          '@store': './src/store',
          '@routes': './src/routes',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@di': './src/di',
          '@mocks': './src/__tests__/__mocks__',
        },
      },
    ],
  ],
};
