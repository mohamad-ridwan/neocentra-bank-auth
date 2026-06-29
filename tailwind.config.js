const isDev = process.env.NODE_ENV === 'development';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    ...(isDev ? [
      "../neocentra-bank-shared/src/**/*.{js,ts,jsx,tsx}",
    ] : [])
  ],
  presets: [require('../neocentra-bank-shared/tailwind.preset.js')],
  theme: {
    extend: {},
  },
  plugins: [],
}
