/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        obsidian: '#0B0D10',
        graphite: '#12151A',
        champagne: '#C8A97E',
        ivory: '#F5F5F7',
        slateMuted: '#8E95A2',
      },
    },
  },
  plugins: [],
};
