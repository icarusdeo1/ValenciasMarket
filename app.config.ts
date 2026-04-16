import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: "Valencia's",
  slug: 'valencias',
  scheme: 'valencias',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#C41E24',
  },
  ios: {
    bundleIdentifier: 'com.valencias.app',
    supportsTablet: false,
  },
  android: {
    package: 'com.valencias.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#C41E24',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: true,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    'expo-font',
    'react-native-edge-to-edge',
    '@sentry/react-native/expo',
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
