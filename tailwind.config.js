/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#C41E24',
          'primary-dark': '#8B1519',
          secondary: '#1B5E20',
          gold: '#D4A844',
        },
        bg: {
          DEFAULT: '#F5F5F5',
          dark: '#121212',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1E1E1E',
        },
        text: {
          primary: '#1A1A1A',
          'primary-dark': '#FFFFFF',
          secondary: '#6B6B6B',
          'secondary-dark': '#A0A0A0',
        },
        error: '#D32F2F',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
      },
    },
  },
  plugins: [],
};
