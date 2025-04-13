/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        coching: {
          nav_color: "#365B6D",
          background: "#EAEDED",
          light_blue: "#232f3A",
          text_color: "#1d8815",
          button_color: "rgb(25, 113, 194)",
        },
        lmsfontend: {
          primary_color: "#FDF8EE",
          secondary_color: "#8AD085",
          tersiary_color: "#FF7426",
          forth_color: "#050C26",
          fifth_color: "#8AD085",
          text_color: "#2e9e28",
        },
      },

      boxShadow: {
        lmsShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
        second_shadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      },
      dropShadow: {
        text_shadow: "2px 7px 5px rgba(0, 0, 0, 0.3)",
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
