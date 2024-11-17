/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        primaryColour: "#383C42",
        textColour: "#383C42",
        navbar: "#D9D9D9",
        secondaryColour: "#82DBD8",
        white: "#FFFFFF",
        fadedPrimaryColour: "#B3B3B3",
        textPlaceholderColour: "#F0F0F0",
        red: "#FF3B30",
      },
      fontFamily: {
        font: "Avenir Next",
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        bold: 700,
        black: 900,
      },
    },
  },
  plugins: [],
};
