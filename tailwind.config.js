/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#edfff4',
        secondary: {
          DEFAULT: "#19B775",
          100: "#8cd2b5",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
          300: "#1F1F1F",
        },
        grayColor: {
          DEFAULT: "#F8F8F8",
          100: "#D9D9D9",
          200: "#fafafa",
          300: "#808080",
          400: "#F5F5F5",
          500: "#a2a2a2",
          600: "#DADADA",
          700: "#ADADAD",
          800: "#F2F2F2",
          900: '#C4C4C4',
        },
        blue: {
          DEFAULT: '#4083fe',
          100: '#0084FF',
          200: '#007AFF'
        },
        red: {
          DEFAULT: '#FF6666',
          100: '#FA0D0D'
        },
        white: {
          DEFAULT: "#FFFFFF",
        },
      },
      fontFamily: {
        robotoBlackItalic: ["Roboto-BlackItalic", "sans-serif"],
        robotoBlack: ["Roboto-Black", "sans-serif"],
        robotoBold: ["Roboto-Bold", "sans-serif"],
        robotoItalic: ["Roboto-Italic", "sans-serif"],
        robotoLight: ["Roboto-Light", "sans-serif"],
        robotoLightItalic: ["Roboto-LightItalic", "sans-serif"],
        robotoMedium: ["Roboto-Medium", "sans-serif"],
        robotoRegular: ["Roboto-Regular", "sans-serif"],
        robotoThin: ["Roboto-Thin", "sans-serif"],
        robotoThinItalic: ["RobotoThinItalic", "sans-serif"],
        sfText: ["SF-Pro-Text", "sans-serif"],
        sfDisplay: ["SF-Pro-Display", "sans-serif"],

      }
    },
  },
  plugins: [],
}

