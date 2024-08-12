/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#1a202c",
        "dark-card": "#2d3748",
        "dark-text": "#a0aec0",
        "dark-border": "#4a5568",
      },
    },
  },
  plugins: [],
};
