import plugin from "tailwindcss/plugin";
import {
  inherit,
  current,
  transparent,
  black,
  white,
  neutral,
} from "tailwindcss/colors";

/** @type {import('tailwindcss').ResolvableTo<RecursiveKeyValuePair>} */
const colors = {
  inherit: inherit,
  current: current,
  transparent: transparent,
  black: black,
  white: white,
  neutral: neutral,
  // https://tailwindcss.com/docs/customizing-colors#color-object-syntax
  // see also https://uicolors.app/create
  // see also https://m3.material.io/styles/color/static/baseline#690f18cd-d40f-4158-a358-4cfdb3a32768
  primary: {
    50: "#e7fffb",
    100: "#c2fff6",
    200: "#8cffee",
    300: "#3dffe2",
    400: "#00ffda",
    500: "#00fff8",
    600: "#00d1e3",
    700: "#00a4b5",
    800: "#008290",
    900: "#006472", // primary
    950: "#004755",
  },
  secondary: {
    50: "#fff0fb",
    100: "#ffe4f9",
    200: "#ffc9f4",
    300: "#ff9cea",
    400: "#ff5fd8",
    500: "#ff30c4",
    600: "#f50da5",
    700: "#d80087", // secondary
    800: "#b0046d",
    900: "#92095d",
    950: "#5b0035",
  },
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase }) {
      const cssVariables = Object.keys(colors).reduce((acc, color) => {
        const colorShades = colors[color];
        if (typeof colorShades === "object") {
          Object.keys(colorShades).forEach((shade) => {
            acc[`--color-${color}-${shade}`] = colorShades[shade].toString();
          });
        } else {
          acc[`--color-${color}`] = colorShades;
        }
        return acc;
      }, {});

      addBase({
        ":root": cssVariables,
      });
    }),
  ],
};
