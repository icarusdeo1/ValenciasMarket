module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@/components': './src/components',
            '@/stores': './src/stores',
            '@/constants': './src/constants',
            '@/hooks': './src/hooks',
            '@/utils': './src/utils',
            '@/types': './src/types',
            '@/services': './src/services',
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
