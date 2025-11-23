/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // if using plain HTML
    "./src/**/*.{js,ts,jsx,tsx}", // for React/Vite
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
