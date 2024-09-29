/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGreen: '#d4f5d4',
        darkGreen: '#006400',
        lightPink: '#FEE3FD',
        darkPink: '#ff4fae',
        neonGreen: '#82ffa5ff',
      },
      fontFamily: {
        'inter': ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}