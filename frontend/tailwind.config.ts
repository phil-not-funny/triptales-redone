import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./**/@material-tailwind/**/*.{html,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#59d97b",
        primaryLight: "#b1e3be",
        primaryHover: "#96e3aa",
        primarySaturated: "#3ddb67",
      },
    },
  },
  plugins: [],
} satisfies Config;
