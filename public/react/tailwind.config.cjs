/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      keyframes:{
        animation:{
            
        }
    },
    backgroundImage: {
      'loginbg': "url('/src/assets/sprites/loginbg.png')",

    }
  },
  },
  plugins: [],
}
