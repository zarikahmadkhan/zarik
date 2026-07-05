import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces — warm charcoal, never pure black
        ink: {
          950: "#0e0f11",
          900: "#15161a",
          800: "#1d1f24",
          700: "#282b31",
          600: "#363a41",
        },
        // Text
        fog: {
          50: "#f2f2ef",
          200: "#cfd0cb",
          400: "#96988f",
          500: "#797b73",
        },
        // Primary accent — muted moss. Calm, adult, not SaaS blue.
        moss: {
          300: "#b9c5a2",
          400: "#9cad7e",
          500: "#819561",
          600: "#69794e",
          700: "#54613e",
        },
        // Secondary accent — desaturated clay for mirrors/warnings
        clay: {
          300: "#d6a88c",
          400: "#c18a67",
          500: "#a86f4d",
        },
        danger: "#b3564d",
      },
      maxWidth: {
        app: "42rem",
      },
      borderRadius: {
        card: "0.875rem",
      },
      minHeight: {
        tap: "2.75rem",
      },
      minWidth: {
        tap: "2.75rem",
      },
    },
  },
  plugins: [],
};
export default config;
