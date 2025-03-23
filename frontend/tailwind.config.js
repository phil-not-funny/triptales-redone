const colors = require("tailwindcss/colors");
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      ...colors.default,
    },
  },
  plugins: {
    "@tailwindcss/postcss": {},
  },
});
