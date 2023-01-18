/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif']
    },
    extend: {
      colors: {
        primary: '#007DF1',
        hoverPrimary: '#2094FF',
        secondary: '#00EF6E',
        third: '#FFB961',
        amrblue: '#2094FF'
      },
      backgroundImage: {
        silent: "url('/assets/images/silent.png')"
      }
    }
  },
  plugins: [require('tailwind-scrollbar')]
};
