This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# CI/CD

GitHub Actions, Android por enquanto: `ci.yml` roda lint + testes (cobertura
100%) em cada PR, e `release.yml` sobe a versão e gera o `.aab` assinado a cada
push em `main` / `develop`. Detalhes e secrets em [`docs/CI-CD.md`](docs/CI-CD.md).

# Testes E2E (Detox)

Além da suíte unitária/componente (`yarn test`), o projeto tem testes de
ponta a ponta com [Detox](https://wix.github.io/Detox/) em `e2e/`, rodando o
app de verdade (build nativo) num emulador/simulador — sem mocks.

```sh
# Android (precisa de um emulador já criado no Android Studio — ajuste o
# avdName em .detoxrc.js pro nome do seu)
yarn e2e:build:android
yarn e2e:test:android

# iOS — precisa primeiro criar um Test Target no Xcode (uma vez só: File →
# New → Target → "UI Testing Bundle"), passo que o Detox não automatiza e
# não pode ser feito fora de um Mac com Xcode
yarn e2e:build:ios
yarn e2e:test:ios
```

Como os testes rodam o app de verdade, o `.env` com `TMDB_ACCESS_TOKEN`
precisa estar configurado (ver "Getting Started" acima) — sem token válido, a
tela de Populares cai em erro e os specs que dependem dela falham.

Os specs selecionam elementos por `testID` (`by.id(...)`) sempre que
possível, e por texto visível (`by.text(...)`) pra navegação entre abas —
os mesmos `testID`/`accessibilityLabel` adicionados para acessibilidade (ver
abaixo) servem de referência estável pros testes, em vez de duplicar
seletores.

# Acessibilidade

Todo elemento interativo (botões, card de filme, campo de busca, abas,
toggle de tema) tem `accessibilityRole`/`accessibilityLabel`/`accessibilityState`
adequados para VoiceOver (iOS) e TalkBack (Android). Dois pontos que valem
a leitura do código como referência:

- `MovieCard` agrupa pôster/título/nota num único elemento de acessibilidade
  (um card = um anúncio de leitor de tela, não fragmentos soltos) e expõe o
  favoritar aninhado como `accessibilityAction` — a forma correta de lidar
  com um botão dentro de outro elemento tocável em React Native, já que um
  `Pressable` aninhado dentro de um container `accessible` fica inalcançável
  por navegação linear do leitor de tela.
- `StateView` usa `accessibilityLiveRegion="polite"` nos estados vazio/erro,
  pra anunciar a mudança sozinho, sem o usuário precisar "descobrir" a tela.

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
