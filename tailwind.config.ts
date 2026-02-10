import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#0f1419",
        surface: "#1a2332",
        coral: "#E07A5F",
        blue: "#5B8DEF",
      },
      fontFamily: {
        garamond: ["'EB Garamond'", "Garamond", "serif"],
        inter: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
