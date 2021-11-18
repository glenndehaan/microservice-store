const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['./frontend/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      'light-blue': colors.lightBlue,
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: { ...colors.gray, 1000: '#0d0d0d' },
      purple: colors.purple,
      amber: colors.amber,
      teal: colors.teal,
      fuchsia: colors.fuchsia,
      cyan: colors.cyan,
      lime: colors.lime,
      rose: colors.rose,
      emerald: colors.emerald,
      orange: colors.orange,
      blue: colors.blue,
      green: colors.green,
      indigo: colors.indigo,
      pink: colors.pink
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
};
