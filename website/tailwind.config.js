const { createPlugin } = require("windy-radix-palette");

const radixColors = createPlugin();

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./theme.config.jsx",
  ],
  theme: {
    extend: {
      textColor: {
        DEFAULT: radixColors.alias("slate.12"),
        low: radixColors.alias("slate.11"),
        hover: radixColors.alias("slate.10"),
      },
      fontFamily: {
        sans: 'var(--font-inter),Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
        accent:
          'var(--font-calsans),-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
      },
    },
  },
  plugins: [radixColors.plugin],
};
