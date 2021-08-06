module.exports = {
  purge: ['./dist/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'yellow': '#f7ff7b;',
        'red':'#FF4848',
        'blue-900':'#002366',
        'blue-700':'#0F52BA',
        'grey-100':'#E8EDDF',
        'grey-200':'#CFDBD5',
        'grey-800':'#333533',
        'grey-900':'#242423',

      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],  
}
