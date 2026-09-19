/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#199690",
        "primary-dark": "#147A75",
        "primary-light": "#E8F7F5",
      },
    },
  },
  plugins: [],
};