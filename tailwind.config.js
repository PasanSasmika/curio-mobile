/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
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