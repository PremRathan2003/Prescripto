module.exports = {
   purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        colors: {
          "primary": "#5F6FFF"
        }
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }