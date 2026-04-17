// eslint.config.js — flat config for ESLint 9+
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: [
      'dist/*',
      'node_modules/*',
      '.expo/*',
      'ios/*',
      'android/*',
      'babel.config.js',
      'metro.config.js',
      'jest.config.js',
      'tailwind.config.js',
      'eslint.config.js',
    ],
  },
];
