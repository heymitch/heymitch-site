import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F0E4D0",
          dark: "#E0D4BE",
        },
        brown: {
          DEFAULT: "#2D2118",
          muted: "#4A3A2A",
        },
        orange: "#E8682A",
        teal: "#2B6B8A",
        green: "#5B8C5A",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"],
        terminal: ["'VT323'", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
