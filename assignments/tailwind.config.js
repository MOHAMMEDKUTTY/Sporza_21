/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/index.html", // <-- This path is now correct
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}