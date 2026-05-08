/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
    container: false,
  },
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontSize: {
        '3xs': '0.55rem', // 8.8
        '2xs': '0.7rem', // 11.2
        '1xs': '0.875rem', // 14
        'base': '0.93rem', // 14.88
        '1xl': '1.125rem', // 18
        '2xl': '1.25rem', // 20
        '3xl': '1.375rem', // 22
      },
      padding: {
        '5x1': '5px',
        '5x2': '10px',
        '5x3': '15px',
        '5x4': '20px',
        '5x5': '25px',
        '5x6': '30px'
      },
      margin: {
        '5x1': '5px',
        '5x2': '10px',
        '5x3': '15px',
        '5x4': '20px',
        '5x5': '25px',
        '5x6': '30px'
      },
      colors: {
        'primary': '#0072BC',
        'primary-opa': '#0072BC2f',
        'primary-dark': '#005a94',
        'primary-light-1x': '#3d91d7',
        'primary-light-2x': '#d6ecff',
        'primary-light-3x': '#f4faff',
        'primary-light-4x': '#fafcff',
        'white': '#fff',
        'white-dark': '#fcfcfc',
        'blue': '#007bff',
        'blue-dark': '#0072ec',
        'indigo': '#3f51b5',
        'indigo-dark': '#32409f',
        'orange': '#ff8e00',
        'orange-dark': '#ff8300',
        'lightred': '#f2dede',
        'lightred-dark': '#ce8483',
        'red': '#f44336',
        'red-dark': '#e64034',
        'hardred': '#a94442',
        'hardred-dark': '#843534',
        'green': '#28a745',
        'green-dark': '#259940',
        'hardgreen': '#009688',
        'hardgreen-dark': '#00796b',
        'yellow': '#ffeb3b',
        'yellow-dark': '#fbc02d',
        'purple': '#aa46bb',
        'purple-dark': '#a234b5',
        'brown': '#795548',
        'brown-dark': '#5d4037',
        'lightgray': '#f5f5f5',
        'lightgray-dark': '#d9d9d9',
        'gray': '#bebebe',
        'gray-dark': '#b7b7b7',
        'lightblack': '#424242',
        'lightblack-dark': '#353535',
      }
    },
    fontFamily: {
      'base': ["WorkSans", "Arial", "sans-serif"]
    },
    fontWeight: {
      'hairline': 100,
      'extra-light': 200,
      'thin': 300,
      'light': 400,
      'normal': 500,
      'medium': 600,
      'bold': 700,
      'extrabold': 800,
      'black': 900
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '5': '5px',
      '6': '6px',
      '7': '7px',
      '8': '8px',
      '9': '9px',
    },
    screens: {
      'xs': '376px',
      'sm': '576px',
      'md': '768px',
      'lg': '992px',
      'xl': '1200px',
      '2xl': '1600px',
    }
  },
  plugins: [],
};
