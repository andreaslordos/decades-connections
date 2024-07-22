/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    fontFamily: {
      classic: ['Georgia', 'Times New Roman', 'Times', 'serif'],
      cheltenham: ["Cheltenham"],
    },
    fontSize: {
      'h1': '2.25rem', // 36px
      'h2': '1.875rem', // 30px
      'h3': '1.5rem', // 24px
      'h4': '1.25rem', // 20px
      'h5': '1.125rem', // 18px
      'h6': '1rem', // 16px
      'h7': '0.875rem', // 14 px
      'mobile': '0.75rem' // 12 px
    },
    colors: {
      'unselected': '#efefe6',
      'selected': '#5a594e',
      ...colors
    }
  },
  plugins: [],
}
