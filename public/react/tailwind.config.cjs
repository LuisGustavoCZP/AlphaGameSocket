/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      keyframes:{
        animation:{
            '0%': {'background-img':'dice1'}
        }
    }
  },
  },
  plugins: [],
}
