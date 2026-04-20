export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      colors: {
        cream: "#f8f6f1",
        coral: { DEFAULT: "#c84b31", dark: "#993C1D", light: "#fef3f0" },
        ink: { DEFAULT: "#1a1a1a", soft: "#444", muted: "#888", faint: "#aaa" },
        border: "#e8e4dc",
      },
    },
  },
  plugins: [],
};