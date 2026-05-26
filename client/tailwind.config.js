/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      // I moved the fontFamily and colors to index.css(to theme inline) cause this tailwind is using version 4.
    },
  },
  plugins: [],
};
