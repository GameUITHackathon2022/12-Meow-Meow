/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        defaultTheme: {
          primary: "#268251",

          secondary: "#CAE8D6",

          greenPastel: "#aad277",

          accent: "#99f7c0",

          neutral: "#251B32",

          "base-100": "#FFFFFF",

          info: "#66A4F0",

          success: "#62DFA3",

          warning: "#F8D94F",

          error: "#E37463",
        },
        extend: {
          fontFamily: {
            montserrat: ['"Montserrat"', "sans-serif"],
            roboto: [],
          },
        },
      },
    ],
  },
  darkMode: "class",
  theme: {
    extend: {},
    
  },
  plugins: [require("daisyui")],
};
